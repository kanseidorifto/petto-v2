using System.ComponentModel.DataAnnotations;
using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class PostComment: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public UserPost Post { get; set; }

    public Guid ProfileId { get; set; }
    public UserProfile Profile { get; set; }

    public string WrittenText { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

