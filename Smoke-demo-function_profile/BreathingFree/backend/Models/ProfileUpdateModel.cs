using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class ProfileUpdateModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
    }
} 