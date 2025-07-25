﻿namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        public string? Gender { get; set; }
        public string? CurrentUsername { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 80;
        public string? Country { get; set; }
        public string? City { get; set; }
        public string OrderBy { get; set; } = "lastActive";

    }
}
