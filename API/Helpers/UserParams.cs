﻿namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;

        public string? Gender { get; set; }
        public string? CurrentUsername { get; set; }
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize ? MaxPageSize : value);
        }

    }
}
