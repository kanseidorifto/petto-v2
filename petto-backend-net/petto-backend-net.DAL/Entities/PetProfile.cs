using System.ComponentModel.DataAnnotations;
using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class PetProfile: ITrackTime
{
    [Key]
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public UserProfile Owner { get; set; }

    public string GivenName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public string? AvatarUrl { get; set; }
    public string Breed { get; set; }
    public int? Age { get; set; }
    public string? Bio { get; set; }

    public ICollection<UserPost> Posts { get; set; }
    public ICollection<PostTaggedPet> TaggedPosts { get; set; }
}

