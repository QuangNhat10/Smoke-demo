using BreathingFree.Models;

public class Message
{
    public int ChatID { get; set; }
    public int FromUserID { get; set; }
    public int ToUserID { get; set; }
    public string MessageContent { get; set; }
    public DateTime SentAt { get; set; }

    // Navigation properties (nếu cần)
    public User Sender { get; set; }
    public User Receiver { get; set; }
}