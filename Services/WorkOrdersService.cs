using Microsoft.EntityFrameworkCore;
using ShopManagement.Data;
using ShopManagement.DTOs;
using ShopManagement.Models;

namespace ShopManagement.Services;

public class WorkOrdersService
{
    private readonly AppDbContext _db;

    public WorkOrdersService(AppDbContext db)
    {
        _db = db;
    }

    // Returns null if vehicle does not exits, List of WorkOrderDto if vehicle exits.
    // List may be empty
    public async Task<List<WorkOrderDto>?> GetWorkOrdersAsync(int vehicleId)
    {
        // Check if this vehicle exists
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(item => item.VehicleId == vehicleId);
        if (vehicle == null)
            return null;

        // Get a list of WorkOrders with matching VehicleIds
        var workOrders = await _db.WorkOrders.Where(item => item.VehicleId == vehicleId).OrderDescending().ToListAsync();

        // Create and return a list of WorkOrderDtos
        var workOrderDtos = new List<WorkOrderDto>();
        foreach (var item in workOrders)
        {
            var cur = await GetWorkOrderAsync(item.WorkOrderId);
            if (cur != null)
                workOrderDtos.Add(cur);
        }
        ;

        return workOrderDtos;
    }

    // Returns null if vehicle with passed ID does not exist
    public async Task<WorkOrderDto?> CreateWorkOrderAsync(int vehicleId, CreateWorkOrderDto dto)
    {

        var vehicle = await _db.Vehicles.Where(v => v.VehicleId == vehicleId).FirstOrDefaultAsync();
        if (vehicle == null)
            return null;

        var newWorkOrder = new WorkOrder
        {
            VehicleId = vehicleId,
            Date = dto.Date,
            TaxRate = GetTaxRate(false), // A work order is not tax free by default
        };

        _db.WorkOrders.Add(newWorkOrder);

        // touch vehicle and customer
        TouchCustomerAndVehicle(vehicle);
        
        await _db.SaveChangesAsync();

        Console.WriteLine(newWorkOrder.Date);
        
        return new WorkOrderDto
        {
            WorkOrderId = newWorkOrder.WorkOrderId,
            VehicleId = newWorkOrder.VehicleId,
            Date = newWorkOrder.Date,
            Notes = newWorkOrder.Notes,
            TaxFree = false // A work order is not tax free by default
        };
    }

    private async Task<WorkOrderDto?> GetWorkOrderAsync(int workOrderId)
    {
        // Get the work order with the ID
        var workOrder = await _db.WorkOrders.Where(item => item.WorkOrderId == workOrderId).FirstOrDefaultAsync();

        if (workOrder == null)
            return null;

        // Get list of labour lines
        var labour = await _db.WorkOrderLines.Where(item => item.WorkOrderId == workOrderId && item.Type == "labour")
            .Select(item => new WorkOrderLineDto
            {
                Name = item.Name,
                Cost = item.Cost
            }).ToListAsync();

        // Get list of parts lines
        var parts = await _db.WorkOrderLines.Where(item => item.WorkOrderId == workOrderId && item.Type == "part")
            .Select(item => new WorkOrderLineDto
            {
                Name = item.Name,
                Cost = item.Cost
            }).ToListAsync();

        // Get list of payment lines
        var payments = await _db.WorkOrderLines.Where(item => item.WorkOrderId == workOrderId && item.Type == "payment")
            .Select(item => new WorkOrderLineDto
            {
                Name = item.Name,
                Cost = item.Cost
            }).ToListAsync();

        // Calculate totals
        var labourTotal = labour.Sum(item => item.Cost);
        var partsTotal = parts.Sum(item => item.Cost);
        var paymentsTotal = payments.Sum(item => item.Cost);
        var subTotal = labourTotal + partsTotal;
        var tax = subTotal * workOrder.TaxRate;
        var taxFree = workOrder.TaxRate == 0m;
        var grandTotal = subTotal + tax;
        var amountDue = grandTotal - paymentsTotal;

        // Return results
        return new WorkOrderDto
        {
            WorkOrderId = workOrder.WorkOrderId,
            VehicleId = workOrder.VehicleId,
            Date = workOrder.Date,
            Notes = workOrder.Notes,
            TaxFree = taxFree,

            LabourTotal = labourTotal,
            PartsTotal = partsTotal,
            PaymentsTotal = paymentsTotal,
            Subtotal = subTotal,
            TaxAmount = tax,
            GrandTotal = grandTotal,
            AmountDue = amountDue,

            Labour = [.. labour],
            Parts = [.. parts],
            Payments = [.. payments]
        };
    }

    public async Task<bool> DeleteWorkOrder(int workOrderId)
    {
        int rowsDeleted = await _db.WorkOrders.Where(item => item.WorkOrderId == workOrderId).ExecuteDeleteAsync();

        if (rowsDeleted > 0)
            return true;
        else
            return false;
    }

    public async Task<WorkOrderDto?> UpdateWorkOrder(int workOrderId, UpdateWorkOrderDto dto)
    {
        // Get work order with passed ID
        var workOrder = await _db.WorkOrders.FirstOrDefaultAsync(item => item.WorkOrderId == workOrderId);

        if (workOrder == null)
            return null;

        // Delete all work order lines for this work order
        await _db.WorkOrderLines.Where(item => item.WorkOrderId == workOrderId).ExecuteDeleteAsync();

        // Update work order and add work order lines
        workOrder.Date = dto.Date;
        workOrder.Notes = dto.Notes;
        workOrder.TaxRate = GetTaxRate(dto.TaxFree);

        var lines = new List<WorkOrderLine>();
        foreach (var labour in dto.Labour)
        {
            lines.Add(new WorkOrderLine
            {
                Type = "labour",
                Name = labour.Name,
                Cost = labour.Cost,
                WorkOrderId = workOrderId,
            });
        }

        foreach (var part in dto.Parts)
        {
            lines.Add(new WorkOrderLine
            {
                Type = "part",
                Name = part.Name,
                Cost = part.Cost,
                WorkOrderId = workOrderId,
            });
        }

        foreach (var payment in dto.Payments)
        {
            lines.Add(new WorkOrderLine
            {
                Type = "payment",
                Name = payment.Name,
                Cost = payment.Cost,
                WorkOrderId = workOrderId,
            });
        }

        await _db.WorkOrderLines.AddRangeAsync(lines);

        // Touch customer and vehicle order
        var vehicle = await _db.Vehicles.FindAsync(workOrder.VehicleId);
        if (vehicle != null)
            TouchCustomerAndVehicle(vehicle);

        await _db.SaveChangesAsync();

        // Get new work order from the database through the api
        var updatedWorkOrder = await GetWorkOrderAsync(workOrderId);

        return updatedWorkOrder;
    }

    private static decimal GetTaxRate(bool taxFree)
    {
        decimal taxRate = 0.12m;
        return taxFree ? 0m : taxRate;
    }

    private async void TouchCustomerAndVehicle(Vehicle vehicle)
    {
        var now = DateTime.UtcNow;

        vehicle.LastEdit = now;

        var customer = new Customer
        {
            PhoneNumber = vehicle.CustomerPhoneNumber,
            LastEdit = now,
        };
        _db.Customers.Attach(customer);
        _db.Entry(customer).Property(c => c.LastEdit).IsModified = true;
    }
}