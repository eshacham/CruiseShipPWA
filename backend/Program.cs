using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using Microsoft.OpenApi.Models; // Needed for Swagger configuration


var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("ItemsDb"));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CruiseShipPWA API", Version = "v1" });
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CruiseShipPWA API V1");
    });
}

app.UseHttpsRedirection();

// Enable CORS using the policy we defined
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

// Models and DbContext can be placed here for simplicity

public class Item
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
    public DbSet<Item> Items { get; set; } 
}