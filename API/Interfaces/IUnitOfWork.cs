using API.Models;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository<AppUser> UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikesRepository LikesRepository { get; }
        ICityRepository CityRepository { get; }
        ICountryRepository CountryRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
