namespace API.Interfaces
{
    public interface IRepository<T>
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllSync();
        Task AddAsync(T entity);
        Task Update(T entity);
        Task Delete(T entity);
    }
}
