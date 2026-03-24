using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Models;

public class WorkOrder
{
    [Key]
    public int WorkOrderId { get; set; }
    public int VehicleId { get; set; }
    public DateOnly Date { get; set; }
    public decimal TaxRate { get; set; }
    public string Notes { get; set; } = "";

    public ICollection<WorkOrderLine> WorkOrderLines { get; set; } = [];
    public Vehicle? Vehicle { get; set; }
}