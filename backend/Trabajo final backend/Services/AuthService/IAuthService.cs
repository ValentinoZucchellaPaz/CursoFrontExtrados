using Models.DTO.Usuarios.Request;

namespace Services.AuthService
{
    public interface IAuthService
    {
        /// <summary>
        /// Genera un access token con claims de id, email y rol que expira en 12 hs
        /// </summary>
        /// <param name="userId">Id del usuario</param>
        /// <param name="userMail">Mail del usuario</param>
        /// <param name="role">Rol del usuario</param>
        /// <returns>Token generado</returns>
        public Task<DTOTokens> GenerateTokens(int userId, string userMail, string role);



        public Task<bool> ValidarRefreshToken(int userId, string token);
        public Task<bool> BorrarRefreshToken(int userId, string token);
    }
}
