using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class QuitProgress
    {
        [Key]
        public int ProgressID { get; set; }
        public int QuitPlanID { get; set; }
        public int UserID { get; set; }
        
        public DateTime Date { get; set; }
        public bool SmokedToday { get; set; } = false;
        public int CigarettesSmoked { get; set; } = 0;
        public decimal MoneySaved { get; set; } = 0;
        public int DaysSmokeFree { get; set; } = 0;
        
        // Ghi chú và cảm xúc
        public string? HealthNote { get; set; }
        public string? MoodRating { get; set; } // very-bad, bad, neutral, good, excellent
        public string? CravingLevel { get; set; } // none, low, medium, high, very-high
        public string? Notes { get; set; }
        
        // Thông tin hỗ trợ đã sử dụng
        public string? SupportUsed { get; set; } // JSON array of support methods used
        public string? TriggersEncountered { get; set; } // JSON array of triggers faced
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual QuitPlan? QuitPlan { get; set; }
        public virtual User? User { get; set; }
    }
} 