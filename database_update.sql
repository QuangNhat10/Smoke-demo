-- ===================================================
-- Database Update Script for Blog & FAQ Features
-- BreathingFree Application
-- ===================================================

USE [Smoking]; -- Thay đổi tên database nếu khác
GO

-- 1. Thêm các cột mới vào bảng CommunityPosts
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'Title')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [Title] NVARCHAR(500) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'Category')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [Category] NVARCHAR(100) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'Tags')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [Tags] NVARCHAR(1000) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'Likes')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [Likes] INT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'Views')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [Views] INT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'IsApproved')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [IsApproved] BIT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'IsFeatured')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [IsFeatured] BIT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = 'UpdatedAt')
BEGIN
    ALTER TABLE [CommunityPosts] ADD [UpdatedAt] DATETIME2 NULL;
END

-- 2. Tạo bảng PostLikes nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PostLikes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [PostLikes] (
        [PostLikeID] INT IDENTITY(1,1) NOT NULL,
        [PostID] INT NOT NULL,
        [UserID] INT NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_PostLikes] PRIMARY KEY CLUSTERED ([PostLikeID] ASC),
        CONSTRAINT [FK_PostLikes_CommunityPosts] FOREIGN KEY ([PostID]) 
            REFERENCES [CommunityPosts] ([PostID]) ON DELETE CASCADE,
        CONSTRAINT [FK_PostLikes_Users] FOREIGN KEY ([UserID]) 
            REFERENCES [Users] ([UserID]),
        CONSTRAINT [UQ_PostLikes_PostID_UserID] UNIQUE ([PostID], [UserID])
    );
END

-- 3. Cập nhật dữ liệu mẫu cho các bài viết hiện có (nếu có)
UPDATE [CommunityPosts] 
SET [IsApproved] = 1, [Likes] = 0, [Views] = 0 
WHERE [IsApproved] IS NULL;

-- 4. Tạo index để tối ưu performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = N'IX_CommunityPosts_PostType_Category')
BEGIN
    CREATE INDEX [IX_CommunityPosts_PostType_Category] ON [CommunityPosts] ([PostType], [Category]);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[CommunityPosts]') AND name = N'IX_CommunityPosts_CreatedAt')
BEGIN
    CREATE INDEX [IX_CommunityPosts_CreatedAt] ON [CommunityPosts] ([CreatedAt] DESC);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[PostLikes]') AND name = N'IX_PostLikes_PostID')
BEGIN
    CREATE INDEX [IX_PostLikes_PostID] ON [PostLikes] ([PostID]);
END

-- 5. Thêm sample data cho demo (tùy chọn)
-- Blog posts mẫu
IF NOT EXISTS (SELECT * FROM [CommunityPosts] WHERE [PostType] = 'Blog')
BEGIN
    INSERT INTO [CommunityPosts] ([UserID], [Title], [Content], [PostType], [Category], [Tags], [Likes], [Views], [IsApproved], [IsFeatured], [CreatedAt])
    VALUES 
    (1, N'Hành trình cai thuốc lá của tôi', N'Sau 15 năm hút thuốc, tôi đã quyết định cai thuốc và đây là những kinh nghiệm quý báu...', 'Blog', N'Kinh nghiệm', N'["cai-thuoc","kinh-nghiem","thanh-cong"]', 15, 120, 1, 1, GETDATE()),
    (1, N'Tác hại của thuốc lá đến sức khỏe', N'Thuốc lá không chỉ ảnh hưởng đến phổi mà còn nhiều cơ quan khác trong cơ thể...', 'Blog', N'Sức khỏe', N'["suc-khoe","tac-hai","phoi"]', 8, 95, 1, 0, GETDATE());
END

-- FAQ mẫu  
IF NOT EXISTS (SELECT * FROM [CommunityPosts] WHERE [PostType] = 'FAQ')
BEGIN
    INSERT INTO [CommunityPosts] ([UserID], [Title], [Content], [PostType], [Category], [Tags], [Likes], [Views], [IsApproved], [IsFeatured], [CreatedAt])
    VALUES 
    (1, N'Tại sao tôi nên cai thuốc lá?', N'Cai thuốc lá mang lại nhiều lợi ích cho sức khỏe như giảm nguy cơ ung thư phổi, bệnh tim mạch...', 'FAQ', N'Thông tin chung', N'["faq","loi-ich","suc-khoe"]', 25, 200, 1, 1, GETDATE()),
    (1, N'Các triệu chứng cai thuốc lá là gì?', N'Các triệu chứng phổ biến bao gồm: thèm thuốc, khó tập trung, dễ cáu gắt...', 'FAQ', N'Triệu chứng', N'["faq","trieu-chung","cai-thuoc"]', 18, 150, 1, 1, GETDATE());
END

PRINT 'Database update completed successfully!';
PRINT 'Added columns: Title, Category, Tags, Likes, Views, IsApproved, IsFeatured, UpdatedAt';
PRINT 'Added table: PostLikes';
PRINT 'Added indexes for performance optimization';
PRINT 'Added sample data for testing';

-- Kiểm tra kết quả
SELECT 
    'CommunityPosts' as TableName,
    COUNT(*) as RecordCount,
    COUNT(CASE WHEN PostType = 'Blog' THEN 1 END) as BlogCount,
    COUNT(CASE WHEN PostType = 'FAQ' THEN 1 END) as FAQCount
FROM [CommunityPosts]
UNION ALL
SELECT 
    'PostLikes' as TableName,
    COUNT(*) as RecordCount,
    0 as BlogCount,
    0 as FAQCount
FROM [PostLikes]; 