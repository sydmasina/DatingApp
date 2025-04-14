using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IRepository<AppUser> _userRepository;

        public UsersController(IRepository<AppUser> userRepository) => _userRepository = userRepository;

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null) return NotFound();

            await _userRepository.Delete(user);

            return Ok();
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null) return NotFound();

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _userRepository.GetAllSync();

            return Ok(users);
        }
    }
}
