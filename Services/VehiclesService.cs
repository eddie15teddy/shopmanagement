using Microsoft.EntityFrameworkCore;
using ShopManagement.Data;
using ShopManagement.DTOs;
using ShopManagement.Models;

namespace ShopManagement.Services;

public class VehiclesService
{
    private readonly AppDbContext _db;

    public VehiclesService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<VehicleDto>> GetVehiclesAsync(string customerPhoneNumber)
    {
        return await _db.Vehicles.Where(v => v.CustomerPhoneNumber == customerPhoneNumber)
        .OrderDescending()
        .Select(v => new VehicleDto
        {
            VehicleId = v.VehicleId,
            CustomerPhoneNumber = v.CustomerPhoneNumber,
            Year = v.Year,
            Make = v.Make,
            Model = v.Model,
            Engine = v.Engine,
            Vin = v.Vin,
            Notes = v.Notes
        }).ToListAsync();
    }

    public async Task<VehicleDto> AddVehicleAsync(string customerPhoneNumber, AddVehicleDto dto)
    {
        var now = DateTime.UtcNow;

        // Add vehicle to DB
        var vehicle = new Vehicle
        {
            CustomerPhoneNumber = customerPhoneNumber,
            Year = dto.Year,
            Make = dto.Make?.Trim(),
            Model = dto.Model?.Trim(),
            Engine = dto.Engine?.Trim(),
            Vin = dto.Vin?.Trim(),
            LastEdit = now,
            Notes = dto.Notes?.Trim(),
        };

        _db.Vehicles.Add(vehicle);

        // touch customer
        var customer = await _db.Customers.FindAsync(customerPhoneNumber);
        if (customer != null)
            customer.LastEdit = now;

        await _db.SaveChangesAsync();


        return new VehicleDto
        {
            VehicleId = vehicle.VehicleId,
            CustomerPhoneNumber = vehicle.CustomerPhoneNumber,
            Year = vehicle.Year,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Engine = vehicle.Engine,
            Vin = vehicle.Vin,
            Notes = vehicle.Notes
        };
    }

    public async Task<VehicleDto?> UpsertVehicleAsync(int vehicleId, UpsertVehicleDto dto)
    {
        var now = DateTime.UtcNow;

        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleId == vehicleId);

        if (vehicle != null)
        {
            vehicle.Year = dto.Year;
            vehicle.Make = dto.Make;
            vehicle.Model = dto.Model;
            vehicle.Engine = dto.Engine;
            vehicle.Notes = dto.Notes;
            vehicle.Vin = dto.Vin;
            vehicle.LastEdit = now;

            // touch customer
            var customer = await _db.Customers.FindAsync(vehicle.CustomerPhoneNumber);
            if (customer != null)
                customer.LastEdit = now;

            await _db.SaveChangesAsync();
            return new VehicleDto
            {
                VehicleId = vehicle.VehicleId,
                Year = vehicle.Year,
                Make = vehicle.Make,
                Model = vehicle.Model,
                Engine = vehicle.Engine,
                Vin = vehicle.Vin,
                Notes = vehicle.Notes,
                CustomerPhoneNumber = vehicle.CustomerPhoneNumber
            };
        }

        return null;

    }
}