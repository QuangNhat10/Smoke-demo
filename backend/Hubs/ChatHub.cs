using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BreathingFree.Hubs
{
    public class ChatHub : Hub
    {
        // Gửi tin nhắn đến một user cụ thể
        public async Task SendMessageToUser(string toUserId, string message, string fromUserId)
        {
            await Clients.User(toUserId).SendAsync("ReceiveMessage", fromUserId, message);
            await Clients.User(fromUserId).SendAsync("ReceiveMessage", fromUserId, message);
        }
    }
} 