using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CountriesController(ICountryRepository countryRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<IEnumerable<CountryDto>> GetCountriesAsync()
        {
            var countries = await countryRepository.GetCountriesAsync();

            return countries;
        }
    }
}
