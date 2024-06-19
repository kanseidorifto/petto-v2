namespace petto_backend_net.DAL.Utils;

public record ChatInfoMessages
{
    public static string ChatRoomGroupCreated() => "Group was created";
    public static string ChatRoomParticipantAdded(string name) => $"{name} was added to the group";
    public static string ChatRoomParticipantRemoved(string name) => $"{name} was removed from the group";
    public static string ChatRoomParticipantLeft(string name) => $"{name} left the group";
}
