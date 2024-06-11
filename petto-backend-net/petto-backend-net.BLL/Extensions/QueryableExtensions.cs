using petto_backend_net.BLL.Interfaces;

namespace petto_backend_net.BLL.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<T> SortByField<T>(this IQueryable<T> source, ISort<T> sorter) where T : class
    {
        return sorter.Sort(source);
    }

    public static IQueryable<T> Filter<T>(this IQueryable<T> source, IFilter<T> filter) where T : class
    {
        return filter.Filter(source);
    }

    public static IQueryable<T> Paginate<T>(this IQueryable<T> source, IPaginate<T> pagination) where T : class
    {
        return pagination.Paginate(source);
    }
}