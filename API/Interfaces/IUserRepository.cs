using API.DTOs;

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
        void Update(T entity);
        void Delete(T entity);
    }
}
