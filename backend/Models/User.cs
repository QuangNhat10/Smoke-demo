namespace BreathingFree.Models
{
    public class User
    {
        public int UserID { get; set; }
        public int RoleID { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public DateTime? DOB { get; set; }
        public string? Avatar { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Status { get; set; }
        
        // Các trường đặc biệt dành cho bác sĩ
        public string? Specialty { get; set; } // Chuyên khoa
        public string? Degrees { get; set; } // Bằng cấp
        public string? Workplace { get; set; } // Nơi làm việc
        public string? TreatmentMethods { get; set; } // Phương pháp điều trị
        public decimal? SuccessRate { get; set; } // Tỷ lệ thành công (%)
        public int? PatientCount { get; set; } // Số lượng bệnh nhân
        public string? ResearchPublications { get; set; } // Các nghiên cứu công bố
        public string? ResponseTimes { get; set; } // Thời gian phản hồi
        public string? Biography { get; set; } // Tiểu sử
        public string? WorkingHours { get; set; } // Giờ làm việc
        public string? Languages { get; set; } // Ngôn ngữ
    }
}
