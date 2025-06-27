using BreathingFree.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BreathingFree.Services;

/// <summary>
/// Controller quản lý hệ thống hỗ trợ và tin nhắn giữa người dùng
/// Cung cấp các API để gửi tin nhắn và lấy cuộc hội thoại
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Đảm bảo người dùng đã đăng nhập trước khi truy cập các endpoint
public class SupportController : ControllerBase
{
    /// <summary>
    /// Service xử lý logic nghiệp vụ cho hệ thống hỗ trợ
    /// Dependency injection từ container
    /// </summary>
    private readonly SupportService _supportService;

    /// <summary>
    /// Constructor khởi tạo SupportController
    /// </summary>
    /// <param name="supportService">Service xử lý logic hỗ trợ và tin nhắn</param>
    public SupportController(SupportService supportService)
    {
        _supportService = supportService;
    }

    /// <summary>
    /// API gửi tin nhắn từ người dùng hiện tại đến người dùng khác
    /// Endpoint: POST /api/support/send
    /// </summary>
    /// <param name="model">Dữ liệu tin nhắn gồm người nhận và nội dung</param>
    /// <returns>Thông tin tin nhắn đã được gửi</returns>
    /// <response code="200">Gửi tin nhắn thành công</response>
    /// <response code="400">Dữ liệu đầu vào không hợp lệ</response>
    /// <response code="401">Người dùng chưa đăng nhập</response>
    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageModel model)
    {
        // Lấy ID người dùng hiện tại từ JWT token
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        // Gọi service để gửi tin nhắn
        var message = await _supportService.SendMessageAsync(userId, model.ToUserId, model.Content);
        
        // Trả về tin nhắn đã được lưu
        return Ok(message);
    }

    /// <summary>
    /// API lấy toàn bộ cuộc hội thoại giữa người dùng hiện tại và người dùng khác
    /// Endpoint: GET /api/support/conversation/{otherUserId}
    /// </summary>
    /// <param name="otherUserId">ID của người dùng khác trong cuộc hội thoại</param>
    /// <returns>Danh sách tất cả tin nhắn trong cuộc hội thoại</returns>
    /// <response code="200">Lấy cuộc hội thoại thành công</response>
    /// <response code="401">Người dùng chưa đăng nhập</response>
    /// <response code="404">Không tìm thấy cuộc hội thoại</response>
    [HttpGet("conversation/{otherUserId}")]
    public async Task<IActionResult> GetConversation(int otherUserId)
    {
        // Lấy ID người dùng hiện tại từ JWT token
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        // Gọi service để lấy tất cả tin nhắn trong cuộc hội thoại
        var messages = await _supportService.GetConversationAsync(userId, otherUserId);
        
        // Trả về danh sách tin nhắn
        return Ok(messages);
    }
}