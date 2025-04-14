using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UserRepository : IRepository<AppUser>
    {
        private DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public Task AddAsync(AppUser entity)
        {
            throw new NotImplementedException();
        }

        public async Task Delete(AppUser user)
        {
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return;
        }

        public async Task<IEnumerable<AppUser>> GetAllSync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<AppUser> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null) throw new KeyNotFoundException();

            return user;
        }

        public Task Update(AppUser entity)
        {
            throw new NotImplementedException();
        }
    }
}
