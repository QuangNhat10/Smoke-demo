using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    /// <summary>
    /// Model dùng để đổi mật khẩu người dùng
    /// Chứa các thông tin cần thiết để thực hiện việc thay đổi mật khẩu
    /// </summary>
    public class ChangePasswordModel
    {
        /// <summary>
        /// Mật khẩu cũ của người dùng
        /// Bắt buộc nhập để xác minh danh tính trước khi đổi mật khẩu
        /// </summary>
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu cũ")]
        public string OldPassword { get; set; }
        
        /// <summary>
        /// Mật khẩu mới mà người dùng muốn đặt
        /// Phải có độ dài tối thiểu 6 ký tự để đảm bảo tính bảo mật
        /// </summary>
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới")]
        [MinLength(6, ErrorMessage = "Mật khẩu mới phải có ít nhất 6 ký tự")]
        public string NewPassword { get; set; }
        
        /// <summary>
        /// Xác nhận mật khẩu mới
        /// Phải trùng khớp với mật khẩu mới để đảm bảo người dùng nhập đúng ý định
        /// </summary>
        [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu mới")]
        [Compare("NewPassword", ErrorMessage = "Mật khẩu xác nhận không khớp với mật khẩu mới")]
        public string ConfirmPassword { get; set; }
    }
} 