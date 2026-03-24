namespace ShopManagement.Controllers;

using Microsoft.AspNetCore.Mvc;
using ShopManagement.DTOs;
using ShopManagement.Services;

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{

    private readonly CustomersService _customersService;
    private readonly VehiclesService _vehiclesService;
    public CustomersController(CustomersService customersService, VehiclesService vehiclesService)
    {
        _customersService = customersService;
        _vehiclesService = vehiclesService;
    }

    [HttpGet("{phoneNumber}")]
    public async Task<IActionResult> Get(string phoneNumber)
    {
        var customer = await _customersService.GetCustomerAsync(phoneNumber);

        if (customer == null)
            return NotFound();

        customer.Vehicles = await _vehiclesService.GetVehiclesAsync(customer.PhoneNumber);
        return Ok(customer);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customers = await _customersService.GetAllCustomersAsync();
        return Ok(customers);
    }

    [HttpPut("{phoneNumber}")]
    public async Task<IActionResult> Upsert(string phoneNumber, UpsertCustomersDto dto)
    {
        var (customer, created) = await _customersService.UpsertCustomerAsync(phoneNumber, dto);

        if (created)
            return CreatedAtAction(nameof(Get), new { phoneNumber = customer.PhoneNumber }, customer);
        else
            return Ok(customer);
    }
}
