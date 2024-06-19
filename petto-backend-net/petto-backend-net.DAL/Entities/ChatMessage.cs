using System.ComponentModel.DataAnnotations;

using petto_backend_net.DAL.Enums;
using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class ChatMessage: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public Guid ChatRoomId { get; set; }
    public ChatRoom ChatRoom { get; set; }

    public Guid SenderProfileId { get; set; }
    public UserProfile SenderProfile { get; set; }

    public MessageType MessageType { get; set; }
    public string? MessageText { get; set; }
    public string? MessageMediaUrls { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }

    public ICollection<ChatParticipant> LastReadedBy { get; set; }
}

