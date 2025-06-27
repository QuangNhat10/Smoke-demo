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

        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> GetCurrentMembership()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var membership = await _context.Memberships
                .Where(m => m.UserID == userId && m.IsActive)
                .OrderByDescending(m => m.EndDate)
                .FirstOrDefaultAsync();

            if (membership == null)
            {
                return NotFound(new { message = "Không tìm thấy gói thành viên đang hoạt động" });
            }

            return Ok(membership);
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
    }
} 