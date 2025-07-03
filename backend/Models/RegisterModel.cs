using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    /*public class RegisterModel
    {
        [Required]
        public string? FullName { get; set; }
        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, MinLength(6)]
        public string? Password { get; set; }
        public string? Gender { get; set; }
        public DateTime? DOB { get; set; }
    }*/
    public class RegisterModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime? DOB { get; set; }
    }

}
