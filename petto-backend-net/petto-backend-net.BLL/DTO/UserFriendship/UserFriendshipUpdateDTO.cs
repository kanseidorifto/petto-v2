namespace petto_backend_net.BLL.DTO.UserFriendship;

public class UserFriendshipUpdateDTO
{
    public Guid ProfileRequestId { get; set; }
    public Guid ProfileAcceptId { get; set; }
    public bool Status { get; set; }
}
