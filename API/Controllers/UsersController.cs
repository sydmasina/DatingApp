using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController(DataContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await context.Users.ToListAsync();

            return Ok(users);
        }
        
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            var user = await context.Users.FindAsync(id);

            if(user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult> AddUser(AppUser user)
        {
            try
            {
                user.Id = 0;

                context.Users.Add(user);

                await context.SaveChangesAsync();

                return Ok();
            }catch(Exception ex)
            {
                return BadRequest($"Unable to add user. \nError: {ex.Message} \n {ex.StackTrace}");
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> EditUser(int id, [FromBody] AppUser userEdit)
        {
            try
            {
                if (id != userEdit.Id)
                {
                    return BadRequest("The provided entry route Id does not match the body entryId.");
                }

                bool userExisting = await context.Users.AnyAsync(user => user.Id == id);

                if (!userExisting) return NotFound();

                context.Users.Entry(userEdit).State = EntityState.Modified;

                await context.SaveChangesAsync();

                return Ok();
            }catch(Exception ex)
            {
                return BadRequest($"Unable to update user. \nError: {ex.Message} \n {ex.StackTrace}");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null) return NotFound();

            context.Users.Remove(user);

            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
