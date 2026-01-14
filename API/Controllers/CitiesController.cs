using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CitiesController(IUnitOfWork unitOfWork) : BaseApiController
    {
        [HttpGet("{countryId:int}")]
        public async Task<IEnumerable<City>> GetCityByCountryIdAsync(int countryId)
        {
            return await unitOfWork.CityRepository.GetCityByCountryId(countryId);
        }
    }
}
