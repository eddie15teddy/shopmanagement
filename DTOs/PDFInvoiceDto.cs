using ShopManagement.Models;

namespace ShopManagement.DTOs;

public class Shop
{
    public string Name { get; set; } = "DIY Auto Repair LTD.";
    public string Address { get; set; } = "530 Cargill Rd, Winkler, MB R6W0K4";
    public string PhoneNumber { get; set; } = "(204) 362-7895";
    public string Email { get; set; } = "diyauto2018@gmail.com";
}


public class InvoiceDataDto
{
    public bool Estimate { get; set; } = false;
    public string InvoiceNumber { get; set; } = "";
    public string Notes { get; set; } = "";
    public Shop Shop { get; set; }
    public Customer Customer { get; set; }
    public Vehicle Vehicle { get; set; }
    public WorkOrderDto WorkOrderDto {get; set;}

    public InvoiceDataDto(Customer _customer, Vehicle _vehicle, WorkOrderDto _workOrderDto)
    {
        Customer = _customer;
        Vehicle = _vehicle;
        WorkOrderDto = _workOrderDto;

        Shop = new Shop();
    }

}