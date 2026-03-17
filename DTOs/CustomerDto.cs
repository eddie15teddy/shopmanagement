namespace ShopManagement.DTOs;

public class CustomerDto
{
    public string PhoneNumber { get; set; } = "";
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }

    public List<VehicleDto> Vehicles { get; set; } = [];
}