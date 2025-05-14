using Configuration;
using Data_Access.DAORefreshToken;
using Data_Access.DAOUsuario;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Models.DTO.Usuarios.Request;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace Services.AuthService
{
    public class AuthService(IOptions<JwtConfig> options, IDAORefreshToken daoRefreshToken) : IAuthService
    {
        private readonly string _jwtKey = options.Value.Secret;
        private readonly string _jwtIssuer = options.Value.Issuer;
        private readonly IDAORefreshToken _daoRefreshToken = daoRefreshToken;

        // se usa datetime.now y no utnnow ya que en db se usa timestamp
        // mysql trabaja el timestamp de manera que lo guarda en formato utc siempre (lo convierte la db) y devuelve en formato de la maquina que lo pide (lo convierte la db)

        public async Task<DTOTokens> GenerateTokens(int userId, string userMail, string role)
        {
            // access token
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new(ClaimTypes.Sid, userId.ToString()),
                new(ClaimTypes.Email, userMail),
                new(ClaimTypes.Role, role)
            };
            DateTime accessTokenExpiration = DateTime.Now.AddMinutes(10);
            var securityToken = new JwtSecurityToken(
                _jwtIssuer,
                _jwtIssuer,
                claims,
                expires: accessTokenExpiration,
                signingCredentials: credentials
            );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(securityToken);

            // refresh token
            string refreshToken = Guid.NewGuid().ToString(); // 36 caracteres
            DateTime refreshTokenExpiration = DateTime.Now.AddDays(7);

            // guardar refresh token (hasheado) en db
            var res = await _daoRefreshToken.GuardarRefreshToken(userId, HashRefreshToken(refreshToken), refreshTokenExpiration);

            if (!res) throw new Exception("no se pudo guardar el refresh token");


            return new DTOTokens()
            {
                AccessToken = accessToken,
                AccessTokenExpiration=accessTokenExpiration,
                RefreshToken = refreshToken,
                RefreshTokenExpiration = refreshTokenExpiration,
            };
        }

        public async Task<bool> ValidarRefreshToken(int userId, string token)
        {
            var refreshToken = await _daoRefreshToken.GetRefreshToken(userId, HashRefreshToken(token));

            return refreshToken != null &&
                    refreshToken.Expiration_date > DateTime.Now &&
                    !refreshToken.Is_revoked;
        }

        public async Task<bool> BorrarRefreshToken(int userId, string token)
        {
            return await _daoRefreshToken.BorrarRefreshToken(userId, HashRefreshToken(token));
        }

        private static string HashRefreshToken(string token)
        {
            var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
