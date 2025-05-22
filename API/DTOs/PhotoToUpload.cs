namespace API.DTOs
{
    public class PhotoToUpload
    {
        public required IFormFile PhotoFile { get; set; }
        public required bool IsMain { get; set; }
    }
}
