using API.DTOs;
using API.Models;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike?> GetUserLike(int sourceId, int targetId);
        Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId);
        Task<IEnumerable<int>> GetCurrentLikeIds(int currentId);
        void DeleteLike(UserLike like);
        void AddLike(UserLike like);
        Task<bool> SaveChanges();
    }
}
