using Models.Entidades;

namespace Data_Access.DAORefreshToken
{
    public interface IDAORefreshToken
    {
        Task<RefreshToken?> GetRefreshToken(int userId, string token);
        Task<bool> GuardarRefreshToken(int userId, string token, DateTime expirationDate);
        Task<bool> BorrarRefreshToken(int userId, string token);
    }
}
