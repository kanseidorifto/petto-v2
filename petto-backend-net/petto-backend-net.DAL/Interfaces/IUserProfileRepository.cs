﻿using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Interfaces;

public interface IUserProfileRepository: IGenericRepository<UserProfile, Guid>
{
}
