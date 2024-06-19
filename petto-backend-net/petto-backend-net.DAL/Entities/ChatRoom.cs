using System.ComponentModel.DataAnnotations;

using petto_backend_net.DAL.Enums;
using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class ChatRoom: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? IconUrl { get; set; }
    public Guid ProfileId { get; set; }
    public ChatType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }

    public UserProfile Profile { get; set; }
    public ICollection<ChatParticipant> Participants { get; set; }
    public ICollection<ChatMessage> Messages { get; set; }
}

