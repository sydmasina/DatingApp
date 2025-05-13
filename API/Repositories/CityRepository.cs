using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class CityRepository(DataContext context) : ICityRepository
    {
        public async Task<IEnumerable<City>> GetCityByCountryId(int countryId)
        {
            return await context.City
                .Where(x => x.CountryId == countryId)
                .ToListAsync();
        }
    }
}
