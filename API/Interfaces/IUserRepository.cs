using API.DTOs;
using API.Enums;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
    public interface IUserRepository<T>
    {
        Task<T?> GetUserByIdAsync(int id);
        Task<T?> GetUserByUsernameAsync(string username);
        Task<IEnumerable<T>> GetAllUsersAsync();
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto?> GetMemberAsync(string username);
        Task<UpdateResult> UpdateMemberAsync(string username, MemberUpdateDto userDto);
        bool Delete(T entity);
        Task<UpdateResult> AddUserPhotoAsync(string username, Photo photo);
        Task<UpdateResult> DeleteUserPhotoByDbIdAsync(string username, int publicId);
    }
}
