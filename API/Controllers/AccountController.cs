using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace API.Controllers
{
    public class AccountController(DataContext context,
        ITokenService tokenService,
        IUserRepository<AppUser> userRepository,
        IMapper mapper,
        PhotoService photoService)
        : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromForm] RegisterDto registerDto)
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
                // Upload Images
                if (registerDto.ImagesToUpload != null && registerDto.ImagesToUpload.Count > 0)
                {
                    foreach (var image in registerDto.ImagesToUpload)
                    {
                        if (image.PhotoFile.Length == 0) continue;

                        var result = await photoService.UploadImageAsync(image.PhotoFile);

                        if (result.Error != null) continue;

                        var photo = new Photo
                        {
                            IsMain = image.IsMain,
                            PublicId = result.PublicId,
                            Url = (result.Url).ToString()
                        };

                        user.Photos.Add(photo);
                    }
                }

                context.Users.Add(user);
                await context.SaveChangesAsync();

                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                    Gender = user.Gender,
                    KnownAs = user.KnownAs
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

                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain == true)?.Url,
                    Gender = user.Gender,
                    KnownAs = user.KnownAs
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
