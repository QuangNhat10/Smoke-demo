using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class RegisterModel
    {
        

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string DOB { get; set; } = string.Empty;
    }

}
