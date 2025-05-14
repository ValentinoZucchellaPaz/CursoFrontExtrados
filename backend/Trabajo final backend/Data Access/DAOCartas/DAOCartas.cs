using Models.Entidades;
using Services.Helpers;

namespace Data_Access.DAOCartas
{
    public class DAOCartas(DbHelper dbHelper) : IDAOCartas
    {
        private DbHelper _dbHelper = dbHelper;

        /* CARTAS */
        public async Task<IEnumerable<Carta>> GetCartasAsync()
        {
            var query = "select * from cartas";
            return await _dbHelper.QueryAsync<Carta>(query);
        }
        public async Task<Carta?> GetCartaByIdAsync(int id)
        {
            var query = "select * from cartas where id=@id";
            return await _dbHelper.QuerySingleOrDefaultAsync<Carta>(query, new { id });
        }
        public async Task<Carta?> GetCartaByNameAsync(string nombre)
        {
            var query = "select * from cartas where nombre=@nombre";
            return await _dbHelper.QuerySingleOrDefaultAsync<Carta>(query, new { nombre });
        }


        /* SERIES */
        public async Task<IEnumerable<Serie>> GetSeriesAsync()
        {
            var query = "select * from series";
            return await _dbHelper.QueryAsync<Serie>(query);
        }
        public async Task<Serie?> GetSerieByIdAsync(int id)
        {
            var query = "select * from series where id=@id";
            return await _dbHelper.QuerySingleOrDefaultAsync<Serie>(query, new { id });
        }
        public async Task<Serie?> GetSerieByNameAsync(string nombre)
        {
            var query = "select * from series where nombre=@nombre";
            return await _dbHelper.QuerySingleOrDefaultAsync<Serie>(query, new { nombre });
        }
        public async Task<IEnumerable<Carta>> GetSerieCardsAsync(int idSerie)
        {
            var query = "select * from cartas where id in (select id_carta from cartas_por_serie where id_serie=@idSerie)";
            return await _dbHelper.QueryAsync<Carta>(query, new { idSerie });
        }

        // COLECCIONES Y MAZOS (get y set)
        public async Task<IEnumerable<CartaDeUsuario>> GetColeccionAsync(int idUsuario)
        {
            var query = "select * from colecciones_cartas where id_usuario=@idUsuario;";
            return await _dbHelper.QueryAsync<CartaDeUsuario>(query, new { idUsuario });
        }
        public async Task<IEnumerable<Mazo>> GetMazosAsync(int idUsuario)
        {
            var query = "select * from mazos where id_usuario=@idUsuario";
            return await _dbHelper.QueryAsync<Mazo>(query, new { idUsuario });
        }
        public async Task<IEnumerable<CartaDeMazo>> GetMazoPorIdAsync(int id)
        {
            var query = "select * from cartas_por_mazo where id_mazo=@id";
            return await _dbHelper.QueryAsync<CartaDeMazo>(query, new { id });
        }
        public async Task<int> AgregarCartasAColeccionAsync(int idUsuario, List<int> idCartas)
        {
            var cartasParaAgregar = idCartas
                .Select(id => new CartaDeUsuario() { Id_carta=id, Id_usuario=idUsuario})
                .ToList();
            var query = @"
                        insert into colecciones_cartas (id_usuario, id_carta)
                        values (@Id_usuario, @Id_carta);";
            return await _dbHelper.ExecuteAsync(query, cartasParaAgregar);
        }
        public async Task<int> RegistrarMazoAsync(int idUsuario)
        {
            var query = @"
            INSERT INTO mazos (id_usuario)
            VALUES (@IdUsuario);
            SELECT LAST_INSERT_ID();"; // Obtiene el ID generado

            return await _dbHelper.ExecuteScalarAsync<int>(query, new { IdUsuario = idUsuario });
        }

        public async Task<int> AgregarAMazoAsync(int idMazo, List<int> idCartas)
        {
            var cartasParaInsertar = idCartas
            .Select(idCarta => new CartaDeMazo { Id_carta = idCarta, Id_mazo = idMazo })
            .ToList();

            // Consulta SQL para insertar múltiples registros
            var query = @"
            INSERT INTO cartas_por_mazo (id_carta, id_mazo)
            VALUES (@Id_carta, @Id_mazo);";

            return await _dbHelper.ExecuteAsync(query, cartasParaInsertar);
        }
    }
}
