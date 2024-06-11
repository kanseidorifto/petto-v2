namespace petto_backend_net.BLL.DTO.UserProfile;

public class UserProfileReadDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public string AvatarUrl { get; set; }
    public string CoverUrl { get; set; }
    public string Bio { get; set; }
}
