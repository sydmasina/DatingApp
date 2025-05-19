using API.DTOs;
using API.Enums;
using API.Helpers;
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

        [Authorize]
        [HttpPost("{username}")]
        public async Task<ActionResult> UpdateUser(string username, [FromBody] MemberUpdateDto memberUpdateData)
        {
            var loggedInUsername = User.Identity?.Name;

            if (username != loggedInUsername)
            {
                return Unauthorized();
            }

            if (memberUpdateData == null)
            {
                return BadRequest();
            }

            UpdateResult updateResult = await userRepository.UpdateMemberAsync(username, memberUpdateData);

            return updateResult switch
            {
                UpdateResult.NotFound => NotFound(ApiResponse<string>.Fail("User not found.", UpdateResult.NotFound)),
                UpdateResult.NoChanges => Ok(ApiResponse<string>.Succes(null, "No changes detected", UpdateResult.NoChanges)),
                UpdateResult.Updated => Ok(ApiResponse<string>.Succes(null, "Profile successfully updated.", UpdateResult.Updated)),
                _ => StatusCode(500, ApiResponse<string>.Fail("An unexpected error occurred."))
            };
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
