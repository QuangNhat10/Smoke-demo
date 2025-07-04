using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace BreathingFree.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var host = _config["Smtp:Host"];
            var portString = _config["Smtp:Port"];
            var username = _config["Smtp:User"];
            var password = _config["Smtp:Pass"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                throw new InvalidOperationException("SMTP configuration is missing. Please add Smtp:Host, Smtp:User, and Smtp:Pass to appsettings.json");
            }

            int port = 587;
            if (!string.IsNullOrEmpty(portString))
            {
                int.TryParse(portString, out port);
            }

            using (var client = new SmtpClient(host, port))
            {
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(username, password);

                var mail = new MailMessage(username, toEmail, subject, body);
                await client.SendMailAsync(mail);
            }
        }
    }
} 