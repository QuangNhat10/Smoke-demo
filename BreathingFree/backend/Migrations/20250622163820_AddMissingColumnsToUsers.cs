using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BreathingFree.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingColumnsToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Kiểm tra xem bảng Users đã tồn tại chưa
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
                BEGIN
                    -- Kiểm tra và thêm cột Phone
                    IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Phone')
                    BEGIN
                        ALTER TABLE Users ADD Phone NVARCHAR(MAX) NULL;
                    END

                    -- Kiểm tra và thêm cột Address
                    IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Address')
                    BEGIN
                        ALTER TABLE Users ADD Address NVARCHAR(MAX) NULL;
                    END

                    -- Kiểm tra và thêm cột Avatar
                    IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Avatar')
                    BEGIN
                        ALTER TABLE Users ADD Avatar NVARCHAR(MAX) NULL;
                    END
                END
                ELSE
                BEGIN
                    -- Tạo bảng Users nếu chưa tồn tại
                    CREATE TABLE Users (
                        UserID INT PRIMARY KEY IDENTITY(1,1),
                        RoleID INT NOT NULL,
                        FullName NVARCHAR(MAX) NULL,
                        Email NVARCHAR(MAX) NULL,
                        PasswordHash NVARCHAR(MAX) NULL,
                        Phone NVARCHAR(MAX) NULL,
                        Address NVARCHAR(MAX) NULL,
                        Gender NVARCHAR(MAX) NULL,
                        DOB DATETIME2 NULL,
                        Avatar NVARCHAR(MAX) NULL,
                        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
                        Status NVARCHAR(MAX) NOT NULL
                    );
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Loại bỏ các cột mới thêm vào nếu cần phải rollback
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
                BEGIN
                    -- Xóa các cột đã thêm
                    IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Phone')
                    BEGIN
                        ALTER TABLE Users DROP COLUMN Phone;
                    END

                    IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Address')
                    BEGIN
                        ALTER TABLE Users DROP COLUMN Address;
                    END

                    IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Avatar')
                    BEGIN
                        ALTER TABLE Users DROP COLUMN Avatar;
                    END
                END
            ");
        }
    }
}
