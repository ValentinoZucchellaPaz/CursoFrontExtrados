using Models.DTO.Juegos.Request;
using Models.Entidades;

namespace Data_Access.DAOTorneo
{
    public interface IDAOTorneo
    {
        public Task<IEnumerable<Torneo>> GetTorneosAsync();
        public Task<Torneo?> GetTorneoByIdAsync(int id);
        public Task<IEnumerable<SeriesTorneo>> GetSeriesTorneoAsync(int id);
        public Task<IEnumerable<int>> GetJuecesTorneoAsync(int id);
        public Task<IEnumerable<InscripcionJugador>> GetInscripcionesAsync(int idTorneo);
        public Task<IEnumerable<Juego>> GetJuegosDeTorneoAsync(int idTorneo);
        public Task<Juego?> GetJuegoDeTorneoPorIdAsync(int idTorneo, int numeroJuego);
        public Task<IEnumerable<int>> ValidarMazo(int idTorneo, int idMazo, int idJugador);
        public Task<bool> ValidarJuezEnTorneo(int idTorneo, int idJuez);
        public Task<bool> InscribirJugadorAsync(int idJugador, int idTorneo, int idMazo);
        public Task<bool> RechazarInscripcionAsync(int idTorneo, int idJugador);
        public Task<bool> CambiarFaseAsync(int idTorneo, FasesTorneo nuevaFase);
        public Task<bool> ComenzarTorneo(int idTorneo, List<DTOCrearJuego> juegos);
        public Task<bool> CargarResultadoJuegoAsync(DTOResultadoJuego juego, int idJuez, int idJuego);
        public Task<bool> CargarJuegosNuevaRonda(int idTorneo, List<DTOActualizarJuego> juegos);
        public Task<int> CrearTorneoAsync(DateTime fechaInicio, int cantDias, int horasPorDia, string pais, int cantRondas, int idOrganizador, IEnumerable<int> seriesIds, IEnumerable<int> juecesIds);
        public Task<bool> EditarTorneo(int idTorneo, List<int>? nuevosJueces, List<int>? nuevasSeries, int? nuevaCantRondas);
        public Task<bool> EditarGanadorJuego(int idTorneo, int numeroJuego, int ganador);
        public Task<bool> EditarJugadoresJuego(int idTorneo, int numeroJuego, int jugadorA, int jugadorB);
        public Task<bool> CancelarTorneoAsync(int idTorneo);
    }
}
