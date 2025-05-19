using API.DTOs;
using API.Enums;
using API.Models;

namespace API.Interfaces
{
    public interface IUserRepository<T>
    {
        Task<T?> GetUserByIdAsync(int id);
        Task<T?> GetUserByUsernameAsync(string username);
        Task<IEnumerable<T>> GetAllUsersAsync();
        Task<bool> SaveAllAsync();
        Task AddUserAsync(T entity);
        Task<IEnumerable<MemberDto>> GetMembersAsync();
        Task<MemberDto?> GetMemberAsync(string username);
        Task<UpdateResult> UpdateMemberAsync(string username, MemberUpdateDto userDto);
        void Delete(T entity);
        Task<UpdateResult> AddUserPhotoAsync(string username, Photo photo);
        Task<UpdateResult> DeleteUserPhotoAsync(string username, string publicId);
    }
}
