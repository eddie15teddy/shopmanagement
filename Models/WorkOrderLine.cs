namespace ShopManagement.Models;
using System.ComponentModel.DataAnnotations;

public class WorkOrderLine
{
    [Key]
    public int LineId {get; set;}
    public int WorkOrderId { get; set; }
    public string Type { get; set; } = "";
    public string Name { get; set; } = "";
    public decimal Cost { get; set; }

    public WorkOrder? WorkOrder { get; set; }
}