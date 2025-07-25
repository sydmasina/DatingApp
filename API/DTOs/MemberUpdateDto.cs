﻿namespace API.DTOs
{
    public class MemberUpdateDto
    {
        public DateOnly? DateOfBirth { get; set; }
        public string? KnownAs { get; set; }
        public string? Gender { get; set; }
        public string? Introduction { get; set; }
        public string? Interests { get; set; }
        public string? LookingFor { get; set; }
        public required string? City { get; set; }
        public required string? Country { get; set; }
        public List<PhotoToUpload>? ImagesToUpload { get; set; }
        public List<PhotoToDelete>? ImagesToDelete { get; set; }
    }
}
