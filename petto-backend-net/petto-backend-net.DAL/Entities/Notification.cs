using petto_backend_net.DAL.Utils.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace petto_backend_net.DAL.Entities;

public class Notification: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public Guid ProfileId { get; set; }
    public UserProfile Profile { get; set; }

    public string Type { get; set; }
    public Guid ReferenceId { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

