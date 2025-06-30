using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BreathingFree.Models;
using BreathingFree.Data;
using System;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembershipController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public class MembershipRequest
        {
            [Required]
            public string PackageName { get; set; } = string.Empty;
            
            [Required]
            public decimal Price { get; set; }
            
            [Required]
            public int DurationDays { get; set; }
            
            [Required]
            public string PaymentMethod { get; set; } = string.Empty;
        }

        public MembershipController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        [Authorize]
        public async Task<IActionResult> RegisterMembership([FromBody] MembershipRequest request)
        {
            try
            {
                var userIdStr = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
                {
                    return Unauthorized();
                }

                // Check if user already has an active membership
                var existingMembership = await _context.Memberships
                    .FirstOrDefaultAsync(m => m.UserID == userId && m.IsActive);

                if (existingMembership != null)
                {
                    return BadRequest("User already has an active membership");
                }

                var startDate = DateTime.UtcNow;
                var endDate = startDate.AddDays(request.DurationDays);

                var membership = new Membership
                {
                    UserID = userId,
                    PackageName = request.PackageName,
                    Price = request.Price,
                    DurationDays = request.DurationDays,
                    StartDate = startDate,
                    EndDate = endDate,
                    PaymentMethod = request.PaymentMethod,
                    PaymentDate = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Memberships.Add(membership);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Membership registered successfully",
                    membership = membership 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentMembership()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
                }

                var membership = await _context.Memberships
                    .Where(m => m.UserID == int.Parse(userId))
                    .OrderByDescending(m => m.EndDate)
                    .FirstOrDefaultAsync();

                if (membership == null)
                {
                    return Ok(new { isActive = false, message = "Bạn chưa có gói thành viên nào." });
                }

                var isActive = membership.EndDate > DateTime.UtcNow;
                return Ok(new
                {
                    isActive,
                    membership.StartDate,
                    membership.EndDate,
                    membership.PackageName,
                    message = isActive ? "Gói thành viên đang hoạt động." : "Gói thành viên đã hết hạn."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi kiểm tra thông tin thành viên.", error = ex.Message });
            }
        }

        public class PackageInfo
        {
            public string Name { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public int DurationDays { get; set; }
            public string? Discount { get; set; }
            public string[] Features { get; set; } = Array.Empty<string>();
        }

        [HttpGet("packages")]
        public IActionResult GetPackages()
        {
            var packages = new[]
            {
                new PackageInfo {
                    Name = "1 Tháng",
                    Price = 600000,
                    DurationDays = 30,
                    Discount = "0%",
                    Features = new[] {
                        "Không giới hạn tư vấn với bác sĩ",
                        "Kế hoạch cai thuốc cá nhân hóa",
                        "Truy cập nội dung cao cấp",
                        "Hỗ trợ từ cộng đồng",
                        "Đánh giá bác sĩ chuyên gia"
                    }
                },
                new PackageInfo {
                    Name = "6 Tháng",
                    Price = 3000000,
                    DurationDays = 180,
                    Discount = "16%",
                    Features = new[] {
                        "Tất cả tính năng từ gói Hàng tháng",
                        "Hỗ trợ bác sĩ ưu tiên",
                        "Báo cáo tiến độ hàng tháng",
                        "Hội thảo sức khỏe độc quyền",
                        "Đánh giá bác sĩ chuyên gia"
                    }
                },
                new PackageInfo {
                    Name = "1 Năm",
                    Price = 5400000,
                    DurationDays = 365,
                    Discount = "25%",
                    Features = new[] {
                        "Tất cả tính năng từ gói 6 tháng",
                        "Huấn luyện viên sức khỏe riêng",
                        "Đánh giá sức khỏe hàng quý",
                        "Tài khoản gia đình (tối đa 3 thành viên)",
                        "Đánh giá bác sĩ chuyên gia"
                    }
                }
            };

            return Ok(packages);
        }

        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetMembershipHistory()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var history = await _context.Memberships
                .Where(m => m.UserID == userId)
                .OrderByDescending(m => m.StartDate)
                .ToListAsync();

            return Ok(history);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateMembership([FromBody] Membership membership)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId) || int.Parse(userId) != membership.UserID)
                {
                    return Unauthorized(new { message = "Bạn không có quyền thực hiện hành động này." });
                }

                // Kiểm tra gói thành viên hiện tại
                var currentMembership = await _context.Memberships
                    .Where(m => m.UserID == membership.UserID && m.EndDate > DateTime.UtcNow)
                    .FirstOrDefaultAsync();

                if (currentMembership != null)
                {
                    return BadRequest(new { message = "Bạn đã có gói thành viên đang hoạt động." });
                }

                // Thêm gói thành viên mới
                membership.StartDate = DateTime.UtcNow;
                membership.EndDate = membership.PackageName switch
                {
                    "1_month" => DateTime.UtcNow.AddMonths(1),
                    "3_months" => DateTime.UtcNow.AddMonths(3),
                    "6_months" => DateTime.UtcNow.AddMonths(6),
                    "1_year" => DateTime.UtcNow.AddYears(1),
                    _ => throw new ArgumentException("Loại gói không hợp lệ")
                };

                _context.Memberships.Add(membership);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đăng ký gói thành viên thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi đăng ký gói thành viên.", error = ex.Message });
            }
        }

        [HttpGet("plans")]
        public IActionResult GetMembershipPlans()
        {
            var plans = new[]
            {
                new {
                    id = "1_month",
                    name = "Gói 1 tháng",
                    price = 99000,
                    description = "Trải nghiệm đầy đủ tính năng trong 1 tháng"
                },
                new {
                    id = "3_months",
                    name = "Gói 3 tháng",
                    price = 269000,
                    description = "Tiết kiệm 10% so với gói 1 tháng"
                },
                new {
                    id = "6_months",
                    name = "Gói 6 tháng",
                    price = 499000,
                    description = "Tiết kiệm 15% so với gói 1 tháng"
                },
                new {
                    id = "1_year",
                    name = "Gói 1 năm",
                    price = 899000,
                    description = "Tiết kiệm 25% so với gói 1 tháng"
                }
            };

            return Ok(plans);
        }
    }
} 