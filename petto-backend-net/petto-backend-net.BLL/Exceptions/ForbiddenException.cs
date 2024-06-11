namespace petto_backend_net.BLL.Exceptions;

public class ForbiddenException(string message) : Exception($"Forbidden - {message}")
{
}
