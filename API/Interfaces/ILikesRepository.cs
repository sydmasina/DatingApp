using API.DTOs;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike?> GetUserLike(int sourceId, int targetId);
        Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
        Task<IEnumerable<int>> GetCurrentLikeIds(int currentId);
        void DeleteLike(UserLike like);
        void AddLike(UserLike like);
    }
}
