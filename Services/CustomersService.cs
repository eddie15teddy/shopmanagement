using Microsoft.EntityFrameworkCore;
using ShopManagement.Data;
using ShopManagement.DTOs;
using ShopManagement.Models;

namespace ShopManagement.Services;

public class CustomersService
{
    private readonly AppDbContext _db;

    public CustomersService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<CustomerDto?> GetCustomerAsync(string phoneNumber)
    {
        return await _db.Customers.Where(c => c.PhoneNumber == phoneNumber)
        .Select(c => new CustomerDto
        {
            PhoneNumber = c.PhoneNumber,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Address = c.Address,
            Notes = c.Notes
        })
        .FirstOrDefaultAsync();
    }

    public async Task<(CustomerDto, bool)> UpsertCustomerAsync(string phoneNumber, UpsertCustomersDto dto)
    {
        bool created = false;
        // Try to fetch a customer from the DB
        var customer = await _db.Customers.FirstOrDefaultAsync(c => c.PhoneNumber == phoneNumber);

        if (customer == null)
        {
            // Customer does not exist, create a new one
            customer = new Customer
            {
                PhoneNumber = phoneNumber.Trim(),
                FirstName = dto.FirstName?.Trim(),
                LastName = dto.LastName?.Trim(),
                Address = dto.Address?.Trim(),
                Notes = dto.Notes?.Trim()
            };

            _db.Customers.Add(customer);
            created = true;
        }
        else
        {
            // Customer exists, update it
            customer.FirstName = dto.FirstName?.Trim();
            customer.LastName = dto.LastName?.Trim();
            customer.Address = dto.Address?.Trim();
            customer.Notes = dto.Notes?.Trim();
        }

        await _db.SaveChangesAsync();

        return (
            new CustomerDto
            {
                PhoneNumber = customer.PhoneNumber,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Address = customer.Address,
                Notes = customer.Notes
            },
            created);
    }
}