using System.ComponentModel.DataAnnotations;
using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class ChatRoom: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public Guid ProfileId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public DateTime LastMessageAt { get; set; }

    public UserProfile Profile { get; set; }
    public ICollection<ChatParticipant> Participants { get; set; }
    public ICollection<ChatMessage> Messages { get; set; }
}

