using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Interfaces;
using System.Linq.Expressions;
using System.Reflection;

namespace petto_backend_net.DAL.Repositories;

public class GenericRepository<TModel, TId>(AppDbContext dbContext) : IGenericRepository<TModel, TId>
    where TModel : class
{
    protected readonly AppDbContext DbContext = dbContext;
    protected readonly DbSet<TModel> DbSet = dbContext.Set<TModel>();

    public virtual Task<List<TModel>> GetAll(Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null)
    {
        return (include != null) ? include(DbSet).ToListAsync() : DbSet.ToListAsync();
    }

    public virtual IQueryable<TModel> GetAllAsIQueryable()
    {
        return DbSet;
    }

    public virtual async Task<TModel?> GetFirstFiltered(Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false)
    {
        var result = GetQuery(filter, orderBy, include, disableTracking);
        return await result.FirstOrDefaultAsync();

    }

    public virtual async Task<TResult?> GetFirstMapped<TResult>(Expression<Func<TModel, TResult>> selector, Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false)
    {
        var query = GetQuery(filter, orderBy, include, disableTracking);
        return await query.Select(selector).FirstOrDefaultAsync();
    }

    public virtual Task<List<TModel>> GetAllFiltered(Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false)
    {
        IQueryable<TModel> query = DbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }
        if (filter != null)
        {
            query = query.Where(filter);
        }
        if (include != null)
        {
            query = include(query);
        }
        if (orderBy != null)
        {
            query = orderBy(query);
        }
        return query.ToListAsync();
    }

    public virtual async Task<List<TResult>> GetAllMapped<TResult>(
        Expression<Func<TModel, TResult>> selector,
        Expression<Func<TModel, bool>>? filter = null,
        Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null,
        Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null,
        bool disableTracking = false)
    {
        IQueryable<TModel> query = GetQuery(filter, orderBy, include, disableTracking);
        return await query.Select(selector).ToListAsync();
    }

    protected IReadOnlyList<PropertyInfo> GetPrimaryKeyProperties()
    {
        var primaryKeyProperties = DbContext.Model.FindEntityType(typeof(TModel))?
            .FindPrimaryKey()?.Properties.Select(p => p.PropertyInfo).ToList();

        if (primaryKeyProperties == null || primaryKeyProperties.Count == 0)
        {
            throw new InvalidOperationException("No primary key defined on entity.");
        }

        return primaryKeyProperties;
    }

    public virtual async Task<TModel?> GetById(IList<TId> keyValues, bool disableTracking = false)
    {
        if (keyValues.Count != GetPrimaryKeyProperties().Count)
        {
            throw new ArgumentException("Incorrect number of key values passed.", nameof(keyValues));
        }

        var parameter = Expression.Parameter(typeof(TModel), "entity");
        Expression? filter = null;

        for (int i = 0; i < keyValues.Count; i++)
        {
            var primaryKeyProperty = GetPrimaryKeyProperties()[i];
            var equalExpression = Expression.Equal(
                Expression.Property(parameter, primaryKeyProperty),
                Expression.Constant(keyValues[i])
            );

            filter = filter == null ? equalExpression : Expression.AndAlso(filter, equalExpression);
        }

        var lambda = Expression.Lambda<Func<TModel, bool>>(filter!, parameter);
        var entity = await GetFirstFiltered(lambda, disableTracking: disableTracking);

        return entity;
    }

    public virtual async Task<TModel?> GetById(TId id, bool disableTracking = false)
    {
        return await GetById([id!], disableTracking);
    }

    public virtual Task<TModel?> GetByIdWithInclude(
        IList<TId> keyValues,
        Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null,
        bool disableTracking = false)
    {
        if (keyValues.Count != GetPrimaryKeyProperties().Count)
        {
            throw new ArgumentException("Incorrect number of key values passed.", nameof(keyValues));
        }

         var parameter = Expression.Parameter(typeof(TModel), "entity");
        Expression? filter = null;

        for (int i = 0; i < keyValues.Count; i++)
        {
            var primaryKeyProperty = GetPrimaryKeyProperties()[i];
            var equalExpression = Expression.Equal(
                Expression.Property(parameter, primaryKeyProperty),
                Expression.Constant(keyValues[i])
            );

            filter = filter == null ? equalExpression : Expression.AndAlso(filter, equalExpression);
        }

        var lambda = Expression.Lambda<Func<TModel, bool>>(filter!, parameter);

        IQueryable<TModel> query = GetQuery(lambda, disableTracking: disableTracking);
        if (include != null)
        {
            query = include(query);
        }
        return query.SingleOrDefaultAsync();
    }
    public virtual Task<TModel?> GetByIdWithInclude(
        TId id,
        Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null,
        bool disableTracking = false)
    {
        return GetByIdWithInclude([id!], include, disableTracking);
    }

    public virtual AppDbContext GetContext()
    {
        return DbContext;
    }

    public virtual async Task Add(TModel entity)
    {
        await DbSet.AddAsync(entity);
        await DbContext.SaveChangesAsync();
    }

    public virtual async Task AddRange(IEnumerable<TModel> entities)
    {
        await DbSet.AddRangeAsync(entities);
        await DbContext.SaveChangesAsync();
    }

    public virtual async Task<TModel> Update(TModel entityToUpdate)
    {
        var primaryKeyProperties = GetPrimaryKeyProperties();
        var keyValues = primaryKeyProperties.Select(p => p.GetValue(entityToUpdate)).ToArray();

        var existingEntity = await DbSet.FindAsync(keyValues);
        if (existingEntity != null)
        {
            DbContext.Entry(existingEntity).State = EntityState.Detached;
        }

        DbSet.Update(entityToUpdate);
        await DbContext.SaveChangesAsync();
        return entityToUpdate;
    }

    public virtual async Task<IEnumerable<TModel>> UpdateRange(ICollection<TModel> entitiesToUpdate, string[]? excludeProperties = null)
    {
        DbSet.AttachRange(entitiesToUpdate);
        foreach (var entity in entitiesToUpdate)
        {
            var entry = DbContext.Entry(entity);
            entry.State = EntityState.Modified;

            if (excludeProperties == null) continue;

            foreach (var property in excludeProperties)
            {
                entry.Property(property).IsModified = false;
            }
        }

        await DbContext.SaveChangesAsync();
        return entitiesToUpdate;
    }

    public virtual async Task Delete(TModel entityToDelete)
    {
        if (DbContext.Entry(entityToDelete).State == EntityState.Detached)
        {
            DbSet.Attach(entityToDelete);
        }

        var primaryKeyProperties = GetPrimaryKeyProperties();
        var keyValues = primaryKeyProperties.Select(p => p.GetValue(entityToDelete)).ToArray();

        var existingEntity = await DbSet.FindAsync(keyValues);
        if (existingEntity != null)
        {
            DbSet.Remove(existingEntity);
            await DbContext.SaveChangesAsync();
        }
    }

    public virtual async Task DeleteRange(IEnumerable<TModel> entitiesToDelete)
    {
        DbSet.RemoveRange(entitiesToDelete);
        await DbContext.SaveChangesAsync();
    }

    public virtual Task<bool> AnyAsync(Expression<Func<TModel, bool>> predicate)
    {
        return DbSet.AnyAsync(predicate);
    }

    public Task LoadReference<TProperty>(TModel entity, Expression<Func<TModel, TProperty>> include)
        where TProperty : class
    {
        return DbContext.Entry(entity).Reference(include!).LoadAsync();
    }

    public Task LoadCollection<TProperty>(TModel entity, Expression<Func<TModel, IEnumerable<TProperty>>> include)
        where TProperty : class
    {
        return DbContext.Entry(entity).Collection(include).LoadAsync();
    }

    public virtual async Task<bool> IsExistsAsync(Expression<Func<TModel, bool>> predicate)
    {
        return await DbSet.FirstOrDefaultAsync(predicate) != null;
    }

    public virtual IQueryable<TModel> GetQuery(Expression<Func<TModel, bool>>? filter = null, Func<IQueryable<TModel>, IOrderedQueryable<TModel>>? orderBy = null, Func<IQueryable<TModel>, IIncludableQueryable<TModel, object>>? include = null, bool disableTracking = false)
    {
        IQueryable<TModel> query = DbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }
        if (filter != null)
        {
            query = query.Where(filter);
        }
        if (include != null)
        {
            query = include(query);
        }
        if (orderBy != null)
        {
            query = orderBy(query);
        }
        return query;
    }
}
