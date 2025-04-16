using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UserRepository(DataContext context) : IUserRepository<AppUser>
    {
        public Task AddUserAsync(AppUser entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(AppUser user)
        {
            context.Users.Remove(user);
        }

        public async Task<IEnumerable<AppUser>> GetAllUsersAsync()
        {
            return await context.Users
                .Include(x => x.Photos)
                .ToListAsync();
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            return await context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public void Update(AppUser user)
        {
            context.Users.Update(user);
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            return await context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName.ToLower() == username.ToLower());
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
