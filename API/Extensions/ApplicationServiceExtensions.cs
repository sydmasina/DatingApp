using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Repositories;
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
            services.AddScoped<ILikesRepository, LikesRepository>();
            services.AddScoped<LogUserActivity>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            return services;
        }
    }
}
