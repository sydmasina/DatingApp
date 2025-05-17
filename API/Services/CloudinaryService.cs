using API.Models;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class CloudinaryService
    {
        public Cloudinary Cloudinary { get; }

        public CloudinaryService(IOptions<CloudinarySettings> config)
        {
            var settings = config.Value;
            var account = new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret);
            Cloudinary = new Cloudinary(account);
        }
    }
}
