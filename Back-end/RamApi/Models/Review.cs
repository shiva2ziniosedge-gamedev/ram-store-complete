namespace RamApi.Models;

public class Review
{
    public int Id { get; set; }           // auto ID
    public int RamId { get; set; }        // which RAM this review is for
    public Ram? Ram { get; set; }         // navigation (links to Ram table)
    public string CustomerName { get; set; } = string.Empty;
    public int Rating { get; set; }       // 1 to 5 stars
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
