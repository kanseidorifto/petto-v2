using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

namespace petto_backend_net.DAL.Interfaces;

public interface IGenericRepository<TModel, TId> where TModel : class
{
    Task<List<TModel>> GetAll(Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null);
    Task<List<TModel>> GetAllFiltered(Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
    Task<TModel?> GetFirstFiltered(Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
    Task<TResult?> GetFirstMapped<TResult>(Expression<Func<TModel, TResult>> selector, Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
    Task<List<TResult>> GetAllMapped<TResult>(Expression<Func<TModel, TResult>> selector, Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
    IQueryable<TModel> GetAllAsIQueryable();
    Task<TModel?> GetById(IList<TId> keyValues, bool disableTracking = false);
    Task<TModel?> GetById(TId id, bool disableTracking = false);
    Task<TModel?> GetByIdWithInclude(IList<TId> keyValues,
        Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
    Task<TModel?> GetByIdWithInclude(TId id,
        Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
    AppDbContext GetContext();
    Task Add(TModel entity);
    Task AddRange(IEnumerable<TModel> entities);
    Task<TModel> Update(TModel entityToUpdate);
    Task<IEnumerable<TModel>> UpdateRange(ICollection<TModel> entitiesToUpdate, string[]? excludeProperties = null);
    Task Delete(TModel entityToDelete);
    Task DeleteRange(IEnumerable<TModel> entitiesToDelete);
    Task<bool> AnyAsync(Expression<Func<TModel, bool>> predicate);
    Task LoadReference<TProperty>(TModel entity, Expression<Func<TModel, TProperty>> include)
        where TProperty : class;
    Task LoadCollection<TProperty>(TModel entity, Expression<Func<TModel, IEnumerable<TProperty>>> include)
        where TProperty : class;
    Task<bool> IsExistsAsync(Expression<Func<TModel, bool>> predicate);
    IQueryable<TModel> GetQuery(Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false);
}
