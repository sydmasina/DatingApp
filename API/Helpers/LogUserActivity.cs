﻿using API.Extensions;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

            var userId = context.HttpContext.User.GetUserId();

            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository<AppUser>>();

            var user = await repo.GetUserByIdAsync(userId);

            if (user == null) return;

            user.LastActive = DateTime.UtcNow;
        }
    }
}
