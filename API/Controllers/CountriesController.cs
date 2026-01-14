using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CountriesController(IUnitOfWork unitOfWork) : BaseApiController
    {
        [HttpGet]
        public async Task<IEnumerable<CountryDto>> GetCountriesAsync()
        {
            var countries = await unitOfWork.CountryRepository.GetCountriesAsync();

            return countries;
        }
    }
}
