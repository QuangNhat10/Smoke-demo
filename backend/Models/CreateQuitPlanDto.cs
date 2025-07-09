using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class CreateQuitPlanDto
    {
        [Required]
        [Range(1, 100, ErrorMessage = "Số điếu thuốc mỗi ngày phải từ 1-100")]
        public int CigarettesPerDay { get; set; }

        [Required]
        [Range(1, 50, ErrorMessage = "Số điếu trong một gói phải từ 1-50")]
        public int CigarettesPerPack { get; set; }

        [Required]
        [Range(1000, 1000000, ErrorMessage = "Giá một gói phải từ 1,000-1,000,000 VNĐ")]
        public decimal PricePerPack { get; set; }

        [Required]
        [Range(1, 80, ErrorMessage = "Số năm hút thuốc phải từ 1-80")]
        public int YearsSmoked { get; set; }

        public DateTime? QuitDate { get; set; }

        public List<string>? Reasons { get; set; }
        public string? OtherReason { get; set; }

        [Required]
        public string Difficulty { get; set; } = "medium"; // easy, medium, hard

        public List<string>? SupportNeeded { get; set; }
        public List<string>? Triggers { get; set; }
        public string? OtherTrigger { get; set; }
        public string? Motivation { get; set; }
    }
} 