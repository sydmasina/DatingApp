using API.DTOs;
using API.Enums;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace API.Data.Repositories
{
    public class UserRepository(UserManager<AppUser> userManager, IMapper mapper) : IUserRepository<AppUser>
    {
        public bool Delete(AppUser user)
        {
            return userManager.DeleteAsync(user).Result.Succeeded;
        }

        public async Task<IEnumerable<AppUser>> GetAllUsersAsync()
        {
            return await userManager.Users
                .Include(x => x.Photos)
                .ToListAsync();
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            return await userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<UpdateResult> UpdateMemberAsync(string username, MemberUpdateDto userDto)
        {
            var user = await userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.NormalizedUserName == username.ToUpper());

            if (user == null) return UpdateResult.NotFound;

            mapper.Map(userDto, user);

            var isModified = userManager.UpdateAsync(user).Result.Succeeded;

            if (!isModified) return UpdateResult.NoChanges;

            return UpdateResult.Updated;
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            return await userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.NormalizedUserName == username.ToUpper());
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = userManager.Users
                  .ProjectTo<MemberDto>(mapper.ConfigurationProvider);

            var today = DateOnly.FromDateTime(DateTime.Today);
            var minDob = today.AddYears(-userParams.MaxAge - 1).AddDays(1);
            var maxDob = today.AddYears(-userParams.MinAge);

            query = query.Where(s => s.DateOfBirth >= minDob && s.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(s => s.Created),
                _ => query.OrderByDescending(s => s.LastActive)
            };

            if (!string.IsNullOrEmpty(userParams.Country) && userParams.Country != "all")
            {
                query = query.Where(s => s.Country == userParams.Country);
            }

            if (!string.IsNullOrEmpty(userParams.City) && userParams.City != "all")
            {
                query = query.Where(s => s.City == userParams.City);
            }

            if (!string.IsNullOrEmpty(userParams.Gender) && userParams.Gender != "all")
            {
                query = query.Where(s => s.Gender == userParams.Gender);
            }

            if (!string.IsNullOrEmpty(userParams.CurrentUsername))
            {
                query = query.Where(s => s.UserName != userParams.CurrentUsername);
            }

            return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await userManager.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<UpdateResult> AddUserPhotoAsync(string username, Photo photo)
        {
            var user = await userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.NormalizedUserName == username.ToUpper());

            if (user == null) return UpdateResult.NotFound;

            user.Photos.Add(photo);

            await userManager.UpdateAsync(user);

            return UpdateResult.Updated;
        }

        public async Task<UpdateResult> DeleteUserPhotoByDbIdAsync(string username, int dbId)
        {
            var user = await userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.NormalizedUserName == username.ToUpper());

            if (user == null) return UpdateResult.NotFound;

            var photo = user.Photos.SingleOrDefault(x => x.Id == dbId);

            if (photo == null) return UpdateResult.NotFound;

            user.Photos.Remove(photo);

            await userManager.UpdateAsync(user);

            return UpdateResult.Updated;
        }
    }
}
