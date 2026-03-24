using Microsoft.EntityFrameworkCore;
using ShopManagement.Models;

namespace ShopManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<WorkOrder> WorkOrders => Set<WorkOrder>();
    public DbSet<WorkOrderLine> WorkOrderLines => Set<WorkOrderLine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>()
            .HasKey(c => c.PhoneNumber);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Customer)
            .WithMany(c => c.Vehicles)
            .HasForeignKey(v => v.CustomerPhoneNumber);

        modelBuilder.Entity<WorkOrder>()
            .HasOne(wo => wo.Vehicle)
            .WithMany(v => v.WorkOrders)
            .HasForeignKey(wo => wo.VehicleId);

        modelBuilder.Entity<WorkOrderLine>()
            .HasOne(wol => wol.WorkOrder)
            .WithMany(wo => wo.WorkOrderLines)
            .HasForeignKey(wol => wol.WorkOrderId);
    }
}