namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dob)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var age = today.Year - dob.Year;

            if (dob > today.AddYears(-age)) age--;

            return age;
        }
        public static string CalculateLastSeen(this DateTime dateTime)
        {
            TimeSpan timeSpan = DateTime.UtcNow - dateTime;

            if (timeSpan.TotalSeconds < 60)
                return $"{timeSpan.Seconds} second{(timeSpan.TotalSeconds >= 2 ? "s" : "")} ago";
            if (timeSpan.TotalMinutes < 60)
                return $"{timeSpan.Minutes} minute{(timeSpan.Minutes >= 2 ? "s": "")} ago";
            if (timeSpan.TotalHours < 24)
                return $"{timeSpan.Hours} hour{(timeSpan.Hours >= 2 ? "s": "")} ago";
            if (timeSpan.TotalDays < 30)
                return $"{timeSpan.Days} day{(timeSpan.TotalDays >= 2 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 365)
                return $"{timeSpan.Days / 30} month{(timeSpan.Days/30 >= 2 ? "s" : "")} ago";

            return $"{timeSpan.Days / 365} year{(timeSpan.Days / 365 >= 2 ? "s" : "")} ago";
        }
    }
}
