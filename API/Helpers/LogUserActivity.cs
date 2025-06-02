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

            var username = context.HttpContext.User.Identity.Name;

            if (username == null) return;

            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository<AppUser>>();

            var user = await repo.GetUserByUsernameAsync(username);

            if (user == null) return;

            user.LastActive = DateTime.UtcNow;

            await repo.SaveAllAsync();
        }
    }
}
