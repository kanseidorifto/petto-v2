using System.ComponentModel.DataAnnotations;
using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class Community: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string? PictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public Guid OwnerId { get; set; }

    public UserProfile Owner { get; set; }
    public ICollection<CommunityMember> CommunityMembers { get; set; }
    public ICollection<UserProfile> Members { get; set; }
    public ICollection<UserPost> Posts { get; set; }
}

