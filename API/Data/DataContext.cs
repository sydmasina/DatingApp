using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<City> City { get; set; }
    }
}
