namespace ShopManagement.DTOs;

public class VehicleDto
{
    public int VehicleId { get; set; }
    public string CustomerPhoneNumber { get; set; } = "";
    public int? Year { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public string? Engine { get; set; }
    public string? Vin { get; set; }
    public string? Notes { get; set; }
}