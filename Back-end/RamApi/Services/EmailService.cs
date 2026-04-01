using MailKit.Net.Smtp;
using MimeKit;

namespace RamApi.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOrderConfirmationAsync(string toEmail, string customerName, string ramName, int quantity, decimal total)
    {
        try
        {
            var from = _config["Email:From"];
            var password = _config["Email:Password"];
            var host = _config["Email:Host"];
            var portStr = _config["Email:Port"];

            Console.WriteLine($"Attempting to send email to {toEmail}");
            Console.WriteLine($"Email config - From: {from}, Host: {host}, Port: {portStr}");

            if (string.IsNullOrEmpty(from) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(host))
            {
                Console.WriteLine("Email configuration is missing");
                return;
            }

            var port = int.Parse(portStr ?? "587");

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "RAM Store - Order Confirmation";

            message.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color:#00d4ff; text-align: center;'>🖥️ RAM Store - Order Confirmed</h2>
                        <div style='background: #f8f9fa; padding: 20px; border-radius: 8px;'>
                            <p>Hi <strong>{customerName}</strong>,</p>
                            <p>Your order has been placed successfully!</p>
                            
                            <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                                <tr style='background: #e9ecef;'>
                                    <td style='padding: 12px; border: 1px solid #dee2e6; font-weight: bold;'>Item</td>
                                    <td style='padding: 12px; border: 1px solid #dee2e6;'>{ramName}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px; border: 1px solid #dee2e6; font-weight: bold;'>Quantity</td>
                                    <td style='padding: 12px; border: 1px solid #dee2e6;'>{quantity}</td>
                                </tr>
                                <tr style='background: #e9ecef;'>
                                    <td style='padding: 12px; border: 1px solid #dee2e6; font-weight: bold;'>Total Amount</td>
                                    <td style='padding: 12px; border: 1px solid #dee2e6; color: #28a745; font-weight: bold;'>₹{total:N2}</td>
                                </tr>
                            </table>
                            
                            <div style='background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                                <p style='margin: 0; color: #856404;'>
                                    <strong>Payment Notice:</strong> ₹{total:N2} will be deducted from your account in 2 business days.
                                </p>
                            </div>
                            
                            <p>Thank you for choosing RAM Store!</p>
                            <p style='color: #6c757d; font-size: 14px;'>
                                Best regards,<br>
                                RAM Store Team
                            </p>
                        </div>
                    </div>"
            };

            using var smtp = new SmtpClient();
            
            Console.WriteLine($"Connecting to SMTP server {host}:{port}");
            await smtp.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);
            
            Console.WriteLine("Authenticating with SMTP server");
            await smtp.AuthenticateAsync(from, password);
            
            Console.WriteLine("Sending email");
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            Console.WriteLine($"Email sent successfully to {toEmail}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email to {toEmail}: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            // Don't throw - we don't want email failures to break the order process
        }
    }
}