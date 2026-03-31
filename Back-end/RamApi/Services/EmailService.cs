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
            var from = _config["Email:From"]!;
            var password = _config["Email:Password"]!;
            var host = _config["Email:Host"]!;
            var port = int.Parse(_config["Email:Port"]!);

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "RAM Store - Order Confirmation";

            message.Body = new TextPart("html")
            {
                Text = $@"
                    <h2 style='color:#0f3460'>RAM Store - Order Confirmed</h2>
                    <p>Hi <b>{customerName}</b>,</p>
                    <p>Your order has been placed successfully!</p>
                    <table border='1' cellpadding='8' style='border-collapse:collapse'>
                        <tr><td>RAM</td><td>{ramName}</td></tr>
                        <tr><td>Quantity</td><td>{quantity}</td></tr>
                        <tr><td>Total</td><td>Rs.{total}</td></tr>
                    </table>
               
                    <p>Thank you for shopping with us!</p>
                    <p style='color:#888'>RAM Store Team</p>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(from, password);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            Console.WriteLine($"Email sent successfully to {toEmail}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email failed: {ex.Message}");
        }
    }
}