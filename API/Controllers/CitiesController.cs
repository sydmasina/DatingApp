using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CitiesController(ICityRepository cityRepository) : BaseApiController
    {
        [Authorize]
        [HttpGet("{countryId:int}")]
        public async Task<IEnumerable<City>> GetCityByCountryIdAsync(int countryId)
        {
            return await cityRepository.GetCityByCountryId(countryId);
        }
    }
}
