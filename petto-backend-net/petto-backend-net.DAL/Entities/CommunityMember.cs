using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class CommunityMember : ITrackTime
{
    public Guid CommunityId { get; set; }
    public Community Community { get; set; }

    public Guid ProfileId { get; set; }
    public UserProfile Profile { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

