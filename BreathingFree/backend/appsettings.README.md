# Hướng dẫn cấu hình appsettings.json

## Tổng quan
File `appsettings.json` chứa các cấu hình quan trọng cho ứng dụng BreathingFree backend. Đây là file cấu hình chính cho ASP.NET Core application.

## Chi tiết các phần cấu hình

### 1. ConnectionStrings (Chuỗi kết nối cơ sở dữ liệu)
```json
"ConnectionStrings": {
    "DefaultConnection": "Server=LAPTOP-N56PGGE3\\SQLEXPRESS;Database=Smoking;User Id=sa;Password=12345;TrustServerCertificate=True;"
}
```
- **Mục đích**: Định nghĩa kết nối đến SQL Server database
- **Server**: Tên server SQL Server (LAPTOP-N56PGGE3\SQLEXPRESS)
- **Database**: Tên database (Smoking)
- **User Id**: Tên đăng nhập (sa)
- **Password**: Mật khẩu (12345)
- **TrustServerCertificate**: Tin tưởng certificate của server

### 2. Jwt (JSON Web Token)
```json
"Jwt": {
    "Key": "ThisIsA256BitSuperSecureJwtKey!!",
    "ExpiryInMinutes": 60,
    "Issuer": "BreathingFreeApp",
    "Audience": "BreathingFreeUsers"
}
```
- **Key**: Khóa bí mật để ký JWT token (phải là 256-bit)
- **ExpiryInMinutes**: Thời gian hết hạn token (60 phút)
- **Issuer**: Nhà phát hành token
- **Audience**: Đối tượng nhận token

### 3. Logging (Ghi log)
```json
"Logging": {
    "LogLevel": {
        "Default": "Information",
        "Microsoft.AspNetCore": "Warning"
    }
}
```
- **Default**: Mức độ log mặc định cho ứng dụng
- **Microsoft.AspNetCore**: Mức độ log cho ASP.NET Core framework
- **Các mức độ log**: Trace, Debug, Information, Warning, Error, Critical

### 4. AllowedHosts (Các host được phép)
```json
"AllowedHosts": "*"
```
- **Mục đích**: Định nghĩa các host được phép truy cập ứng dụng
- **"*"**: Cho phép tất cả các host (chỉ dùng trong development)

### 5. CorsSettings (Cấu hình CORS)
```json
"CorsSettings": {
    "AllowedOrigins": [
        "http://localhost:3000",
        "http://localhost:5173"
    ]
}
```
- **Mục đích**: Cấu hình Cross-Origin Resource Sharing
- **AllowedOrigins**: Danh sách các domain được phép gọi API
- **localhost:3000**: Thường là React app
- **localhost:5173**: Thường là Vite dev server

### 6. FileUploadSettings (Cấu hình upload file)
```json
"FileUploadSettings": {
    "AvatarPath": "wwwroot/uploads/avatars",
    "MaxFileSize": 5242880,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".gif"]
}
```
- **AvatarPath**: Đường dẫn lưu trữ avatar
- **MaxFileSize**: Kích thước file tối đa (5MB = 5242880 bytes)
- **AllowedExtensions**: Các định dạng file được phép upload

## Lưu ý bảo mật

### ⚠️ Cảnh báo bảo mật:
1. **JWT Key**: Khóa JWT hiện tại quá đơn giản cho production
2. **Database Password**: Mật khẩu database không nên để trực tiếp trong file cấu hình
3. **AllowedHosts**: Nên giới hạn các host cụ thể trong production

### 🔒 Khuyến nghị:
1. Sử dụng **User Secrets** cho development
2. Sử dụng **Azure Key Vault** hoặc **Environment Variables** cho production
3. Tạo JWT key phức tạp hơn (ít nhất 256-bit random)
4. Sử dụng **Windows Authentication** thay vì SA account

## Cách sử dụng trong code

### Đọc ConnectionString:
```csharp
var connectionString = configuration.GetConnectionString("DefaultConnection");
```

### Đọc JWT settings:
```csharp
var jwtKey = configuration["Jwt:Key"];
var jwtIssuer = configuration["Jwt:Issuer"];
```

### Đọc custom settings:
```csharp
var corsOrigins = configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();
```

## File appsettings khác

- **appsettings.Development.json**: Cấu hình cho môi trường development
- **appsettings.Production.json**: Cấu hình cho môi trường production
- **appsettings.Staging.json**: Cấu hình cho môi trường staging

## Thứ tự ưu tiên cấu hình
1. appsettings.json (base)
2. appsettings.{Environment}.json
3. User secrets (development only)
4. Environment variables
5. Command line arguments 