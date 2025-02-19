using API.Interfaces;
using API.Models;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace API.Services
{
    public class TokenService(IConfiguration config) : ITokenService
    {
        string ITokenService.CreateToken(AppUser user)
        {
            var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot access tokenKey from appsettings");

            if (tokenKey.Length < 64) throw new Exception("TokenKey needs to be at least 64 characters");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

            var claims = new List<Claim>
            {
                new (ClaimTypes.Name, user.UserName)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
