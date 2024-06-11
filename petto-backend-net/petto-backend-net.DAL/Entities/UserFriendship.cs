using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class UserFriendship: ITrackTime
{
    public Guid ProfileRequestId { get; set; }
    public UserProfile ProfileRequest { get; set; }

    public Guid ProfileAcceptId { get; set; }
    public UserProfile ProfileAccept { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }

    public bool Status { get; set; }

}

