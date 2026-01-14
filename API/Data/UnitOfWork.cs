using API.Interfaces;
using API.Models;

namespace API.Data
{
    public class UnitOfWork(DataContext context, IUserRepository<AppUser> userRepository, 
        ILikesRepository likesRepository, IMessageRepository messageRepository, 
        ICityRepository cityRepository, ICountryRepository countryRepository) : IUnitOfWork
    {
        public IUserRepository<AppUser> UserRepository => userRepository;

        public IMessageRepository MessageRepository => messageRepository;

        public ILikesRepository LikesRepository => likesRepository;

        public ICityRepository CityRepository => cityRepository;

        public ICountryRepository CountryRepository => countryRepository;

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}
