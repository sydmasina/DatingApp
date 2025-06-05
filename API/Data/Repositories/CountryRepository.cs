using API.Data;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class CountryRepository(DataContext context, IMapper mapper) : ICountryRepository
    {
        public async Task<IEnumerable<CountryDto>> GetCountriesAsync()
        {
            return await context.Countries
                .ProjectTo<CountryDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
