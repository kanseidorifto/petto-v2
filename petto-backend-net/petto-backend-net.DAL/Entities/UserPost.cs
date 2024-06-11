using petto_backend_net.DAL.Utils.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace petto_backend_net.DAL.Entities;

public class UserPost: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public Guid ProfileId { get; set; }
    public UserProfile Profile { get; set; }

    public Guid? CommunityId { get; set; }
    public Community Community { get; set; }

    public string? WrittenText { get; set; }
    public string? MediaLocations { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public int ViewsCount { get; set; } = 0;

    public ICollection<PostLike> Likes { get; set; }
    public ICollection<PostComment> Comments { get; set; }
    public ICollection<PostTaggedPet> PostTaggedPets { get; set; }

    public ICollection<PetProfile> TaggedPets { get; set; }
}
