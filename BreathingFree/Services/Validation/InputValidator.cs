

using System.Text.RegularExpressions;
using BreathingFree.Models;
using global::BreathingFree.Models;

namespace BreathingFree.Services.Validation
{

    public static class InputValidator
    {
        // Kiểm tra đăng ký thành viên
        /*public static List<string> ValidateRegister(RegisterModel model)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(model.FullName))
                errors.Add("Full name is required.");
            else if (!Regex.IsMatch(model.FullName, @"^([A-Z][a-z]+\s?)+$"))
                errors.Add("Each word in full name must start with a capital letter and contain only letters.");

            if (string.IsNullOrWhiteSpace(model.Email))
                errors.Add("Email is required.");
            else if (!Regex.IsMatch(model.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                errors.Add("Invalid email format.");

            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6)
                errors.Add("Password must be at least 6 characters.");
            else if (!Regex.IsMatch(model.Password, @"^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{6,}$"))
                errors.Add("Password must contain at least one number and one special character.");

            if (model.Gender != "Nam" && model.Gender != "Nữ")
                errors.Add("Gender must be either 'Nam' or 'Nữ'.");

            if (model.DOB == null)
                errors.Add("Date of birth is required.");

            return errors;
        }*/
        public static List<string> ValidateRegister(RegisterModel model)
        {
            var errors = new List<string>();

            // FullName
            if (string.IsNullOrWhiteSpace(model.FullName))
                errors.Add("Full name is required.");
            else if (!Regex.IsMatch(model.FullName, @"^([A-Z][a-z]+\s?)+$"))
                errors.Add("Each word must start with a capital letter and contain only letters.");

            // Email
            if (string.IsNullOrWhiteSpace(model.Email))
                errors.Add("Email is required.");
            else if (!Regex.IsMatch(model.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                errors.Add("Invalid email format.");

            // Password
            if (string.IsNullOrWhiteSpace(model.Password))
                errors.Add("Password is required.");
            else if (model.Password.Length < 6)
                errors.Add("Password must be at least 6 characters.");
            else if (!Regex.IsMatch(model.Password, @"^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{6,}$"))
                errors.Add("Password must contain at least one number and one special character.");

            // Gender
            if (string.IsNullOrWhiteSpace(model.Gender))
                errors.Add("Gender is required.");
            else if (model.Gender != "Nam" && model.Gender != "Nữ")
                errors.Add("Gender must be either 'Nam' or 'Nữ'.");
            return errors;

            // DOB
            /*if (model.DOB == null)
                errors.Add("Date of birth is required.");

            return errors;*/
            if (string.IsNullOrWhiteSpace(model.DOB))
            {
                errors.Add("Date of birth is required.");
            }
            else if (!DateTime.TryParse(model.DOB, out _))
            {
                errors.Add("Date of birth must be a valid format (yyyy-MM-dd).");
            }

        }


        // Kiểm tra đăng nhập
        public static List<string> ValidateLogin(LoginModel model)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(model.Email))
                errors.Add("Email is required.");

            if (string.IsNullOrWhiteSpace(model.Password))
                errors.Add("Password is required.");

            return errors;
        }

        // Kiểm tra kế hoạch cai thuốc (sẽ dùng sau này)
        // public static List<string> ValidateQuitPlan(QuitPlanModel model) { ... }

        // Kiểm tra tiến trình hút thuốc (sẽ dùng sau này)
        // public static List<string> ValidateSmokingStatus(SmokingStatusModel model) { ... }
    }
}

