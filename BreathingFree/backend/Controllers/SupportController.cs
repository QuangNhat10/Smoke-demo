using BreathingFree.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BreathingFree.Services;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Đảm bảo người dùng đã đăng nhập
public class SupportController : ControllerBase
{
    private readonly SupportService _supportService;

    public SupportController(SupportService supportService)
    {
        _supportService = supportService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageModel model)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var message = await _supportService.SendMessageAsync(userId, model.ToUserId, model.Content);
        return Ok(message);
    }

    [HttpGet("conversation/{otherUserId}")]
    public async Task<IActionResult> GetConversation(int otherUserId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var messages = await _supportService.GetConversationAsync(userId, otherUserId);
        return Ok(messages);
    }
}