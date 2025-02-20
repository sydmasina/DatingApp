﻿using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration config)
        {
            var connectionString = config.GetConnectionString("DefaultConnection");

            services.AddControllers();
            services.AddOpenApi();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(options => options.UseSqlite(connectionString));
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
