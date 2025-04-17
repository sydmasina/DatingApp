using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController(IUserRepository<AppUser> userRepository, IMapper mapper) : BaseApiController
    {
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await userRepository.GetUserByIdAsync(id);

            if (user == null) return NotFound();

            userRepository.Delete(user);

            bool hasDeletedSomething = await userRepository.SaveAllAsync();

            if (!hasDeletedSomething)
            {
                return StatusCode(500, "Failed to delete the user. Please try again.");
            }

            return Ok();
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await userRepository.GetMemberAsync(username);

            if (user == null) return NotFound();

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();

            return Ok(users);
        }
    }
}
