using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

/// <summary>
/// Controller xử lý các thao tác liên quan đến bác sĩ
/// Yêu cầu xác thực để truy cập các endpoint
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Yêu cầu người dùng phải đăng nhập để truy cập
public class DoctorController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    /// <summary>
    /// Constructor - Khởi tạo controller với dependency injection
    /// </summary>
    /// <param name="context">Database context để truy cập dữ liệu</param>
    public DoctorController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lấy danh sách tất cả bác sĩ đang hoạt động
    /// GET: api/doctor
    /// </summary>
    /// <returns>Danh sách bác sĩ với thông tin cơ bản</returns>
    [HttpGet]
    public async Task<IActionResult> GetDoctors()
    {
        // Lọc user có RoleID = 3 (bác sĩ) và Status = "Active" (đang hoạt động)
        var doctors = _context.Users
            .Where(u => u.RoleID == 3 && u.Status == "Active") // Điều kiện lọc bác sĩ
            .Select(u => new { // Chỉ lấy những thông tin cần thiết
                userId = u.UserID,      // ID của bác sĩ
                fullName = u.FullName,  // Họ tên đầy đủ
                email = u.Email,        // Email liên hệ
                avatar = u.Avatar       // Ảnh đại diện
            })
            .ToList(); // Thực thi query và chuyển thành List
            
        return Ok(doctors); // Trả về danh sách bác sĩ với status 200 OK
    }
} 