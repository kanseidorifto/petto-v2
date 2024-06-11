namespace petto_backend_net.BLL.Exceptions;

public class BadRequestException(string message) : Exception($"Bad request - {message}")
{
}
