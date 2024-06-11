using petto_backend_net.DAL.Utils.Interfaces;

namespace petto_backend_net.DAL.Entities;

public class PostTaggedPet: ITrackTime
{
    public Guid PostId { get; set; }
    public UserPost Post { get; set; }

    public Guid PetProfileId { get; set; }
    public PetProfile PetProfile { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

