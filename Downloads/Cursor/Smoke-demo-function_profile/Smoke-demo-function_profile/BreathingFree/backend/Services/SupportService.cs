using BreathingFree.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SimpleUserDto
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Avatar { get; set; }
}

public class SupportService
{
    private readonly ApplicationDbContext _context;

    public SupportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Message> SendMessageAsync(int senderId, int toUserId, string content)
    {
        // Kiểm tra tồn tại
        var message = new Message
        {
            FromUserID = senderId,
            ToUserID = toUserId,
            MessageContent = content,
            SentAt = DateTime.UtcNow
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<List<Message>> GetConversationAsync(int userId, int otherUserId)
    {
        return await _context.Messages
            .Where(m => (m.FromUserID == userId && m.ToUserID == otherUserId) ||
                        (m.FromUserID == otherUserId && m.ToUserID == userId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();
    }

    // Nếu muốn lấy tin nhắn chưa đọc, cần thêm trường IsRead vào bảng Messages.
    // Nếu không có, bạn có thể bỏ qua hàm này hoặc chỉnh lại cho phù hợp.
    // public async Task<List<Message>> GetUserUnreadMessagesAsync(int userId)
    // {
    //     return await _context.Messages
    //         .Where(m => m.ToUserID == userId && !m.IsRead)
    //         .OrderBy(m => m.SentAt)
    //         .ToListAsync();
    // }

    // public async Task MarkMessageAsReadAsync(int messageId)
    // {
    //     var message = await _context.Messages.FindAsync(messageId);
    //     if (message != null)
    //     {
    //         message.IsRead = true;
    //         await _context.SaveChangesAsync();
    //     }
    // }

    public async Task<List<SimpleUserDto>> GetPatientsChattedWithDoctorAsync(int doctorId)
    {
        var userIds = await _context.Messages
            .Where(m => m.FromUserID == doctorId || m.ToUserID == doctorId)
            .Select(m => m.FromUserID == doctorId ? m.ToUserID : m.FromUserID)
            .Distinct()
            .ToListAsync();

        return await _context.Users
            .Where(u => userIds.Contains(u.UserID) && u.RoleID != 1)
            .Select(u => new SimpleUserDto
            {
                UserId = u.UserID,
                Name = u.FullName,
                Avatar = u.Avatar
            })
            .ToListAsync();
    }
}           