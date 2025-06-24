using System;
using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? FeedbackText { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.Now;
    }
}
