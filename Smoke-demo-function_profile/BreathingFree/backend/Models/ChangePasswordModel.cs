using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class ChangePasswordModel
    {
        [Required]
        public string OldPassword { get; set; } = string.Empty;
        
        [Required]
        [MinLength(6, ErrorMessage = "Mật khẩu mới phải có ít nhất 6 ký tự")]
        public string NewPassword { get; set; } = string.Empty;
        
        [Required]
        [Compare("NewPassword", ErrorMessage = "Mật khẩu xác nhận không khớp với mật khẩu mới")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
} 