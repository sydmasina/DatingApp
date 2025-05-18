using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        private readonly PhotoService _photoService;

        public PhotosController(PhotoService photoService)
        {
            _photoService = photoService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> UploadPhotos(IFormFile file)
        {
            var result = await _photoService.UploadImageAsync(file);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeletePhoto([FromQuery] string publicId)
        {
            var result = await _photoService.DeleteImageAsync(publicId);
            return Ok(result);
        }
    }
}
