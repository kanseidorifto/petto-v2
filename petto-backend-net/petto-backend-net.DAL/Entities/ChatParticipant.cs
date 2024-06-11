using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class ChatParticipant: ITrackTime
{
    public Guid ChatRoomId { get; set; }
    public ChatRoom ChatRoom { get; set; }

    public Guid ProfileId { get; set; }
    public UserProfile Profile { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

