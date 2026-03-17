namespace ShopManagement.Controllers;

using Microsoft.AspNetCore.Mvc;
using ShopManagement.DTOs;
using ShopManagement.Services;

[ApiController]
public class VehicleController : ControllerBase
{
    private readonly VehiclesService _vehicleService;

    public VehicleController(VehiclesService vehiclesService)
    {
        _vehicleService = vehiclesService;
    }

    [HttpPost("api/customers/{customerPhoneNumber}/vehicles")]
    public async Task<IActionResult> Add(string customerPhoneNumber, AddVehicleDto dto)
    {
        var vehicle = await _vehicleService.AddVehicleAsync(customerPhoneNumber, dto);

        return CreatedAtAction(nameof(CustomersController.Get), "Customers", new { phoneNumber = customerPhoneNumber }, vehicle);
    }

    [HttpPut("api/vehicles/{vehicleId}")]
    public async Task<IActionResult> Upsert(int vehicleId, UpsertVehicleDto dto)
    {
        var vehicle = await _vehicleService.UpsertVehicleAsync(vehicleId, dto);

        if (vehicle == null)
            return NotFound($"Vehicle ID {vehicleId} not found");
        else
            return Ok(vehicle);
    }
}