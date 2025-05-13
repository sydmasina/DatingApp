using API.DTOs;

namespace API.Interfaces
{
    public interface ICountryRepository
    {
        Task<IEnumerable<CountryDto>> GetCountriesAsync();
    }
}
