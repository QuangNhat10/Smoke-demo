namespace BreathingFree.Models
{
    public class User
    {
         public int UserID { get; set; }
    public int RoleID { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? Gender { get; set; }
    public DateTime? DOB { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Status { get; set; }
    }
}
