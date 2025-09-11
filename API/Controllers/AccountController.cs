using API.DTOs;
using API.Interfaces;
using API.Models;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager,
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

                var user = mapper.Map<AppUser>(registerDto);
                if (user.UserName == null)
                {
                    return BadRequest("Username is required");
                }

                user.UserName = registerDto.Username.ToLower();

                // Upload Images
                if (registerDto.ImagesToUpload != null && registerDto.ImagesToUpload.Count > 0)
                {
                    foreach (var image in registerDto.ImagesToUpload)
                    {
                        if (image.PhotoFile.Length == 0) continue;

                        var photoServiceResult = await photoService.UploadImageAsync(image.PhotoFile);

                        if (photoServiceResult.Error != null) continue;

                        var photo = new Photo
                        {
                            IsMain = image.IsMain,
                            PublicId = photoServiceResult.PublicId,
                            Url = (photoServiceResult.Url).ToString()
                        };

                        user.Photos.Add(photo);
                    }
                }

                var createUserResult = await userManager.CreateAsync(user, registerDto.Password);

                if (!createUserResult.Succeeded) return BadRequest(createUserResult.Errors);

                return new UserDto
                {
                    Username = user.UserName,
                    Token = await tokenService.CreateToken(user),
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

                if (user == null || user.UserName == null)
                {
                    return Unauthorized("User not found.");
                }

                var isValidPassword = await userManager.CheckPasswordAsync(user, loginDto.Password);

                if (!isValidPassword) return Unauthorized("Email or Password invalid");

                return new UserDto
                {
                    Username = user.UserName,
                    Token = await tokenService.CreateToken(user),
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
