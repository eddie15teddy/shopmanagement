namespace ShopManagement.DTOs;

public class WorkOrderDto
{
    public int WorkOrderId { get; set; }
    public int VehicleId { get; set; }
    public DateOnly Date { get; set; }
    public string Notes { get; set; } = "";
    public bool TaxFree { get; set; } = false;

    public decimal LabourTotal { get; set; }
    public decimal PartsTotal { get; set; }
    public decimal PaymentsTotal { get; set; }
    public decimal Subtotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal GrandTotal { get; set; }
    public decimal AmountDue { get; set; }

    public WorkOrderLineDto[] Labour { get; set; } = [];
    public WorkOrderLineDto[] Parts { get; set; } = [];
    public WorkOrderLineDto[] Payments { get; set; } = [];
}