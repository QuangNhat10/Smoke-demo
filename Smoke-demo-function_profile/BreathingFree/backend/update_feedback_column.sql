-- Đổi kiểu dữ liệu của cột FeedbackText từ text thành NVARCHAR(1000)
ALTER TABLE [dbo].[Feedback]
DROP COLUMN [FeedbackText];
 
ALTER TABLE [dbo].[Feedback]
ADD [FeedbackText] NVARCHAR(1000) NULL; 