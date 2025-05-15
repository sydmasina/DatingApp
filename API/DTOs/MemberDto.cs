namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public string? Age { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? KnownAs { get; set; }
        public string? PhotoUrl { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string? Gender { get; set; }
        public string? Introduction { get; set; }
        public string? Interests { get; set; }
        public string? LookingFor { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public List<PhotoDto> Photos { get; set; } = [];
    }
}
