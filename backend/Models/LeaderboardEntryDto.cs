namespace BreathingFree.Models
{
    public class LeaderboardEntryDto
    {
        public int UserID { get; set; }
        public string? FullName { get; set; }
        public int DaysSmokeFree { get; set; }
        public decimal MoneySaved { get; set; }
        public string? LatestHealthNote { get; set; }
    }
} 