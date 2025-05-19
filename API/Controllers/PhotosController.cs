using API.Interfaces;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController(PhotoService photoService, IUserRepository<AppUser> userRepository) : BaseApiController
    {

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> UploadPhotos(IFormFile file)
        {
            var username = User.Identity?.Name;

            if (username == null)
            {
                return Unauthorized();
            }

            var result = await photoService.UploadImageAsync(file);

            if (result.Error != null)
            {
                return StatusCode(500);
            }

            var photo = new Photo
            {
                IsMain = false,
                PublicId = result.PublicId,
                Url = (result.Url).ToString()
            };

            await userRepository.AddUserPhotoAsync(username, photo);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeletePhoto([FromQuery] string publicId)
        {
            var username = User.Identity?.Name;

            if (username == null)
            {
                return Unauthorized();
            }

            var result = await photoService.DeleteImageAsync(publicId);

            if (result.Error != null)
            {
                return StatusCode(500);
            }

            await userRepository.DeleteUserPhotoAsync(username, publicId);

            return Ok(result);
        }
    }
}
