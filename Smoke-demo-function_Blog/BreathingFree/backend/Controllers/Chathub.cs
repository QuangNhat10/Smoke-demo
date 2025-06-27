using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    public async Task SendMessage(string senderId, string receiverId, string message)
    {
        // Gửi tin nhắn đến client cụ thể (theo receiverId)
        await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
    }
}
