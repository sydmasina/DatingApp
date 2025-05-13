using API.Models;

namespace API.Interfaces
{
    public interface ICityRepository
    {
        public Task<IEnumerable<City>> GetCityByCountryId(int countryId);
    }
}
