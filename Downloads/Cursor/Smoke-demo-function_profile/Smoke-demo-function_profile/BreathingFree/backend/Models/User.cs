namespace BreathingFree.Models
{
    public class User
    {
         public int UserID { get; set; }
    public int RoleID { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Gender { get; set; }
    public DateTime? DOB { get; set; }
    public string? Avatar { get; set; }
    public DateTime CreatedAt { get; set; } = new DateTime(2024, 6, 22, 12, 0, 0);
    public string Status { get; set; }
    }
}
