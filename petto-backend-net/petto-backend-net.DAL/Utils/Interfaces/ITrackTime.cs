namespace petto_backend_net.DAL.Utils.Interfaces
{
    public interface ITrackTime
    {
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }
    }
}
