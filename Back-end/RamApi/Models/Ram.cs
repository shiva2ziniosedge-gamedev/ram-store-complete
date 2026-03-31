namespace RamApi.Models;

public class Ram
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Warranty { get; set; } = string.Empty;
    public string DdrType { get; set; } = string.Empty;
    public int SpeedMhz { get; set; }
    public int CapacityGb { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Description { get; set; } = string.Empty;

}
