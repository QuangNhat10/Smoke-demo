using BreathingFree.Data;
using BreathingFree.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Builder;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Kết nối database từ appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2️⃣ Đăng ký AuthService (nếu dùng DI)
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<SupportService>();
builder.Services.AddScoped<QuitPlanService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Thêm cấu hình CORS cho phép frontend truy cập
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3️⃣ Add controller và swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Ensure proper UTF-8 encoding for Vietnamese characters
        options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
        options.JsonSerializerOptions.WriteIndented = false;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen( c =>
    {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BreathingFree API", Version = "v1" });
}); // nên dùng thay vì AddOpenApi()

// Thêm cấu hình lưu trữ file tĩnh
builder.Services.AddDirectoryBrowser(); // Cho phép duyệt thư mục
builder.Services.AddHttpContextAccessor(); // Thêm IHttpContextAccessor

var app = builder.Build();

// 4️⃣ Swagger UI cho môi trường dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 5️⃣ Middleware cơ bản
app.UseHttpsRedirection();

// Thêm middleware CORS vào pipeline, đặt trước UseAuthentication
app.UseCors();

// Middleware để đảm bảo UTF-8 encoding
app.Use(async (context, next) =>
{
    // Only set response content-type for API responses, not for all requests
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.OnStarting(() =>
        {
            if (!context.Response.Headers.ContainsKey("Content-Type"))
            {
                context.Response.Headers.Add("Content-Type", "application/json; charset=utf-8");
            }
            return Task.CompletedTask;
        });
    }
    await next();
});

app.UseAuthentication();

app.UseAuthorization();

// Thêm middleware phục vụ file tĩnh
app.UseStaticFiles(); // Phục vụ file tĩnh từ wwwroot

// Đảm bảo thư mục uploads tồn tại
var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
    Directory.CreateDirectory(Path.Combine(uploadsDir, "avatars"));
}

app.MapControllers();

app.Run();