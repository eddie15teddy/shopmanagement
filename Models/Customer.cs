using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Models;

public class Customer
{
    [Key]
    public string PhoneNumber { get; set; } = "";
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }

    public ICollection<Vehicle> Vehicles {get; set;} = [];
}