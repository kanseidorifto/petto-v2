﻿using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.DAL.Repositories;

public class UserProfileRepository(AppDbContext dbContext): GenericRepository<UserProfile, Guid>(dbContext), IUserProfileRepository
{
}
