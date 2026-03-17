namespace ShopManagement.DTOs;

public class UpdateWorkOrderDto
{
    public DateOnly Date { get; set; }
    public string Notes { get; set; } = "";
    public bool TaxFree { get; set; } = false;


    public WorkOrderLineDto[] Labour { get; set; } = [];
    public WorkOrderLineDto[] Parts { get; set; } = [];
    public WorkOrderLineDto[] Payments { get; set; } = [];

}