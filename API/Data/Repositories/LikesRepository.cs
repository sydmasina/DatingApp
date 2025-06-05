﻿using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class LikesRepository(DataContext context, IMapper mapper) : ILikesRepository
    {
        public void AddLike(UserLike like)
        {
            context.Likes.Add(like);
        }

        public void DeleteLike(UserLike like)
        {
            context.Likes.Remove(like);
        }

        public async Task<IEnumerable<int>> GetCurrentLikeIds(int currentUserId)
        {
            return await context.Likes
                .Where(x => x.SourceUserId == currentUserId)
                .Select(x => x.TargetUserId)
                .ToListAsync();
        }

        public async Task<UserLike?> GetUserLike(int sourceId, int targetId)
        {
            return await context.Likes
                .FindAsync(sourceId, targetId);
        }

        public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId)
        {
            var likes = context.Likes.AsQueryable();

            switch (predicate)
            {
                case "liked":
                    return await likes
                        .Where(x => x.SourceUserId == userId)
                        .Select(x => x.TargetUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
                case "likedBy":
                    return await likes
                        .Where(x => x.TargetUserId == userId)
                        .Select(x => x.SourceUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
                default:
                    var likeIds = await GetCurrentLikeIds(userId);
                    return await likes
                        .Where(x => x.TargetUserId == userId && likeIds.Contains(x.SourceUserId))
                        .Select(x => x.SourceUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
            }
        }

        public async Task<bool> SaveChanges()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
