using petto_backend_net.DAL.Enums;
using petto_backend_net.BLL.Interfaces;
using System.Linq.Expressions;

namespace petto_backend_net.BLL.Filtering;

public abstract class BaseFilteringModel<T> : ISort<T>, IPaginate<T> where T : class
{
    public string? SortingField { get; set; }
    public SortingOrder SortingOrder { get; set; }
    public int PageNumber { get; set; } = 0;
    public int PageSize { get; set; } = 15;

    public virtual IQueryable<T> Sort(IQueryable<T> source)
    {
        if (string.IsNullOrEmpty(SortingField))
            return source;

        var entityProperties = typeof(T).GetProperties();
        var sortByField = entityProperties.FirstOrDefault(p => p.Name.ToLower() == SortingField.ToLower());

        if (sortByField == null)
            throw new ArgumentException("Incorrect sort option.");

        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, sortByField.Name);
        var lambda = Expression.Lambda(property, parameter);

        if (SortingOrder == SortingOrder.Asc)
            return Queryable.OrderBy(source, (dynamic)lambda);
        else
            return Queryable.OrderByDescending(source, (dynamic)lambda);
    }

    public virtual IQueryable<T> Paginate(IQueryable<T> source)
    {
        return source.Skip(PageNumber * PageSize).Take(PageSize);
    }
}
