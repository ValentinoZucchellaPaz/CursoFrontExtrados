using Models.Entidades;

namespace Data_Access.DAOCartas
{
    public interface IDAOCartas
    {
        // CARTAS Y SERIES
        public Task<IEnumerable<Carta>> GetCartasAsync();
        public Task<Carta?> GetCartaByIdAsync(int id);
        public Task<Carta?> GetCartaByNameAsync(string nombre);
        public Task<IEnumerable<Serie>> GetSeriesAsync();
        public Task<Serie?> GetSerieByIdAsync(int id);
        public Task<Serie?> GetSerieByNameAsync(string nombre);
        public Task<IEnumerable<Carta>> GetSerieCardsAsync(int idSerie);
        // COLECCIONES Y MAZOS
        public Task<IEnumerable<CartaDeUsuario>> GetColeccionAsync(int idUsuario);
        public Task<IEnumerable<Mazo>> GetMazosAsync(int idUsuario);
        public Task<IEnumerable<CartaDeMazo>> GetMazoPorIdAsync(int id);
        public Task<int> AgregarCartasAColeccionAsync(int idUsuario, List<int> idCartas);
        public Task<int> RegistrarMazoAsync(int idUsuario);
        public Task<int> AgregarAMazoAsync(int idMazo, List<int> idCartas);
    }
}
