using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController(DataContext context, ITokenService tokenService, IUserRepository<AppUser> userRepository,
        IMapper mapper)
        : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            try
            {
                bool isUsernameTaken = await IsUsernameTaken(registerDto.Username);

                if (isUsernameTaken)
                {
                    return BadRequest("Username already exists.");
                }

                using var hmac = new HMACSHA512();

                var user = mapper.Map<AppUser>(registerDto);
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);
                await context.SaveChangesAsync();

                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user)
                };
            }
            catch (Exception ex)
            {
                return BadRequest($"Unable to add user. \nError: {ex.Message} \n {ex.StackTrace}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            try
            {
                var user = await userRepository.GetUserByUsernameAsync(loginDto.Username);

                if (user == null)
                {
                    return Unauthorized("User not found.");
                }

                using var hmac = new HMACSHA512(user.PasswordSalt);

                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != user.PasswordHash[i])
                    {
                        return Unauthorized("Invalid password.");
                    }
                }

                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user)
                };
            }
            catch (Exception ex)
            {
                return BadRequest($"Unable to login. \nError: {ex.Message} \n {ex.StackTrace}");
            }
        }

        private async Task<bool> IsUsernameTaken(string username)
        {
            return await userRepository.GetUserByUsernameAsync(username) != null;
        }
    }
}
