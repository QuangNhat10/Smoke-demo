using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class ProfileUpdateModel
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Avatar { get; set; }
    }
} 