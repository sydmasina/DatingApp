using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController(DataContext context) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                bool isUsernameTaken = await IsUsernameTaken(registerDto.Username);

                if (isUsernameTaken)
                {
                    return BadRequest("Username already exists.");
                }

                using var hmac = new HMACSHA512();

                var user = new AppUser
                {
                    UserName = registerDto.Username.ToLower(),
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key
                };

                context.Users.Add(user);
                await context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Unable to add user. \nError: {ex.Message} \n {ex.StackTrace}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
        {
            try
            {
                var user = await context.Users.FirstOrDefaultAsync(user => user.UserName.ToLower() == loginDto.Username.ToLower());

                if (user == null) {
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

                return user;
            }
            catch (Exception ex)
            {
                return BadRequest($"Unable to login. \nError: {ex.Message} \n {ex.StackTrace}");
            }
        }

        private async Task<bool> IsUsernameTaken(string username)
        {
            return await context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
        }
    }
}
