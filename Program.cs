using Microsoft.EntityFrameworkCore;
using ShopManagement.Data;
using ShopManagement.Services;

var builder = WebApplication.CreateBuilder(args);

// Front end
builder.WebHost.UseUrls("http://localhost:5000");

// Controllers
builder.Services.AddControllers();

// Db
var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).UseSnakeCaseNamingConvention()
);

// Services
builder.Services.AddScoped<CustomersService>();
builder.Services.AddScoped<VehiclesService>();
builder.Services.AddScoped<WorkOrdersService>();

builder.Services.AddCors(option =>
{
    option.AddPolicy("CORS", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localohost:5000", "https://shopmanagement-b0gkgbaxckdtbxc9.canadacentral-01.azurewebsites.net")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Static files
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Setup
app.UseCors("CORS");
app.MapControllers();

app.Run();
