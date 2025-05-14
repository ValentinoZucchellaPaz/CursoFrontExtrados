using Models.Entidades;
using Services.Helpers;

namespace Data_Access.DAORefreshToken
{
    public class DAORefreshToken(DbHelper dbHelper) : IDAORefreshToken
    {
        private readonly DbHelper _dbHelper = dbHelper;
        public async Task<RefreshToken?> GetRefreshToken(int userId, string refreshToken)
        {
            string queryGetToken = "select * from refresh_tokens where user_id=@userId and token=@refreshToken";
            return await _dbHelper.QuerySingleOrDefaultAsync<RefreshToken>(queryGetToken, new { userId, refreshToken });
        }

        public async Task<bool> GuardarRefreshToken(int userId, string token, DateTime expirationDate)
        {
            string querySaveToken = "insert into refresh_tokens (user_id, token, expiration_date, is_revoked) values (@userId, @token, @expirationDate, false)";
            var filasAfectadas = await _dbHelper.ExecuteAsync(querySaveToken, new { userId, token, expirationDate });
            return filasAfectadas > 0;
        }

        public async Task<bool> BorrarRefreshToken(int userId, string refreshToken)
        {
            string queryDeleteToken = "update refresh_tokens set is_revoked=true where user_id=@userId and token=@refreshToken";
            var filasAfectadas = await _dbHelper.ExecuteAsync(queryDeleteToken, new { userId, refreshToken });
            return filasAfectadas > 0;
        }
    }
}
