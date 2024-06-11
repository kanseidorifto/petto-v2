using petto_backend_net.BLL.Exceptions;
using System.Security.Claims;

namespace petto_backend_net.Helpers
{
    public class GetUserId
    {
        public static Guid GetUserIdFromClaims(ClaimsPrincipal user)
        {
            if (!Guid.TryParse(user.FindFirstValue(ClaimTypes.NameIdentifier), out Guid currentUserId))
            {
                throw new ForbiddenException("Invalid user id");
            }

            return currentUserId;
        }
    }
}
