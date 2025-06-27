using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DoctorController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DoctorController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/doctor
    [HttpGet]
    public async Task<IActionResult> GetDoctors()
    {
        // Giả sử RoleID = 3 là bác sĩ
        var doctors = _context.Users
            .Where(u => u.RoleID == 3 && u.Status == "Active")
            .Select(u => new {
                userId = u.UserID,
                fullName = u.FullName,
                email = u.Email,
                avatar = u.Avatar
            })
            .ToList();
        return Ok(doctors);
    }
} 