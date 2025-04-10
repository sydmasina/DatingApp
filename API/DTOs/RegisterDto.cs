using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
