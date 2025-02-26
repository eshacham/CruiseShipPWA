using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


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