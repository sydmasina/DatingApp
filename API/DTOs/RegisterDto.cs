using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(20, MinimumLength = 4)]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public DateOnly DateOfBirth { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string? Introduction { get; set; }
        [Required]
        public string? Interests { get; set; }
        [Required]
        public string? LookingFor { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public List<PhotoToUpload>? ImagesToUpload { get; set; }
    }
}
