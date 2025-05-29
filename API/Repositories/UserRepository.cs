using API.Data;
using API.DTOs;
using API.Enums;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace API.Repositories
{
    public class UserRepository(DataContext context, IMapper mapper) : IUserRepository<AppUser>
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

        public async Task<UpdateResult> UpdateMemberAsync(string username, MemberUpdateDto userDto)
        {
            var user = await context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName.ToLower() == username.ToLower());

            if (user == null) return UpdateResult.NotFound;

            mapper.Map(userDto, user);

            var isModified = context.Entry(user).Properties.Any(p => p.IsModified);

            if (!isModified) return UpdateResult.NoChanges;

            await context.SaveChangesAsync();

            return UpdateResult.Updated;
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

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = context.Users
                  .ProjectTo<MemberDto>(mapper.ConfigurationProvider);

            if (!String.IsNullOrEmpty(userParams.Gender) && userParams.Gender != "all")
            {
                query = query.Where(s => s.Gender == userParams.Gender);
            }

            var today = DateOnly.FromDateTime(DateTime.Today);
            var minDob = today.AddYears((int)(-userParams.MaxAge - 1)).AddDays(1);
            var maxDob = today.AddYears((int)-userParams.MinAge);
            query = query.Where(s => s.DateOfBirth >= minDob && s.DateOfBirth <= maxDob);

            if (!String.IsNullOrEmpty(userParams.Country) && userParams.Country != "all")
            {
                query = query.Where(s => s.Country == userParams.Country);
            }

            if (!String.IsNullOrEmpty(userParams.City) && userParams.City != "all")
            {
                query = query.Where(s => s.City == userParams.City);
            }

            if (!String.IsNullOrEmpty(userParams.Gender) && userParams.Gender != "all")
            {
                query = query.Where(s => s.Gender == userParams.Gender);
            }

            if (!String.IsNullOrEmpty(userParams.CurrentUsername))
            {
                query = query.Where(s => s.UserName != userParams.CurrentUsername);
            }

            return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<UpdateResult> AddUserPhotoAsync(string username, Photo photo)
        {
            var user = await context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName.ToLower() == username.ToLower());

            if (user == null) return UpdateResult.NotFound;

            user.Photos.Add(photo);

            var result = await context.SaveChangesAsync();

            return UpdateResult.Updated;
        }

        public async Task<UpdateResult> DeleteUserPhotoByDbIdAsync(string username, int dbId)
        {
            var user = await context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName.ToLower() == username.ToLower());

            if (user == null) return UpdateResult.NotFound;

            var photo = user.Photos.SingleOrDefault(x => x.Id == dbId);

            if (photo == null) return UpdateResult.NotFound;

            user.Photos.Remove(photo);

            await context.SaveChangesAsync();

            return UpdateResult.Updated;
        }
    }
}
