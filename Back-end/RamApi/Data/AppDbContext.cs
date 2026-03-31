using Microsoft.EntityFrameworkCore;
using RamApi.Models;

namespace RamApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Ram> Rams => Set<Ram>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ram>().Property(r => r.Price).HasPrecision(18, 2);

        modelBuilder.Entity<Ram>().HasData(
            new Ram { Id = 1,  Name = "Fury Beast DDR4",     Brand = "Kingston",  Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3200, CapacityGb = 8,  Price = 2499,  Stock = 10 },
            new Ram { Id = 2,  Name = "Fury Beast DDR4",     Brand = "Kingston",  Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3200, CapacityGb = 16, Price = 4599,  Stock = 8  },
            new Ram { Id = 3,  Name = "Vengeance LPX",       Brand = "Corsair",   Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3000, CapacityGb = 8,  Price = 2299,  Stock = 5  },
            new Ram { Id = 4,  Name = "Vengeance LPX",       Brand = "Corsair",   Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3000, CapacityGb = 16, Price = 4299,  Stock = 0  },
            new Ram { Id = 5,  Name = "Trident Z RGB",       Brand = "G.Skill",   Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3600, CapacityGb = 16, Price = 5499,  Stock = 6  },
            new Ram { Id = 6,  Name = "Trident Z5 RGB",      Brand = "G.Skill",   Warranty = "Lifetime", DdrType = "DDR5", SpeedMhz = 6000, CapacityGb = 32, Price = 12999, Stock = 4  },
            new Ram { Id = 7,  Name = "Ripjaws V",           Brand = "G.Skill",   Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3200, CapacityGb = 8,  Price = 2199,  Stock = 12 },
            new Ram { Id = 8,  Name = "Ripjaws V",           Brand = "G.Skill",   Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3200, CapacityGb = 16, Price = 4099,  Stock = 7  },
            new Ram { Id = 9,  Name = "Ballistix Sport",     Brand = "Crucial",   Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 2666, CapacityGb = 8,  Price = 1999,  Stock = 0  },
            new Ram { Id = 10, Name = "Pro DDR5",            Brand = "Crucial",   Warranty = "5 Years",  DdrType = "DDR5", SpeedMhz = 5600, CapacityGb = 16, Price = 7499,  Stock = 3  },
            new Ram { Id = 11, Name = "XPG Lancer",          Brand = "ADATA",     Warranty = "Lifetime", DdrType = "DDR5", SpeedMhz = 5200, CapacityGb = 16, Price = 6999,  Stock = 5  },
            new Ram { Id = 12, Name = "XPG Spectrix D50",    Brand = "ADATA",     Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3600, CapacityGb = 16, Price = 5199,  Stock = 9  },
            new Ram { Id = 13, Name = "Dominator Platinum",  Brand = "Corsair",   Warranty = "Lifetime", DdrType = "DDR5", SpeedMhz = 5600, CapacityGb = 32, Price = 14999, Stock = 2  },
            new Ram { Id = 14, Name = "T-Force Vulcan Z",    Brand = "TeamGroup", Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3200, CapacityGb = 8,  Price = 1899,  Stock = 15 },
            new Ram { Id = 15, Name = "T-Force Delta RGB",   Brand = "TeamGroup", Warranty = "Lifetime", DdrType = "DDR4", SpeedMhz = 3200, CapacityGb = 16, Price = 3999,  Stock = 0  }
        );
    }
}
