namespace RamApi.Models;

public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int RamId { get; set; }
    public Ram? Ram { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; } = "Booked"; // Booked, Confirmed, StockOut
    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;
}
