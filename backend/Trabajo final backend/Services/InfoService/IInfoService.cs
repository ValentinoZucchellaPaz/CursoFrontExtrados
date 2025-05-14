using Models.DTO.Cartas.Response;
using Models.DTO.Juegos.Response;
using Models.DTO.Torneos.Response;
using Models.Entidades;

namespace Services.InfoService
{
    public interface IInfoService
    {
        public Task<List<Carta>> GetCartasDisponibles();
        public Task<Carta> GetCarta(string id);
        public Task<List<DTOSerie>> GetSeriesDisponibles();
        public Task<DTOSerie> GetSerie(string id);
        public Task<List<DTOInfoTorneo>> GetTorneosDisponibles();
        public Task<DTOInfoTorneo> GetTorneoPorId(int idTorneo);
        public Task<DTOJuego> GetJuegoTorneo(int idTorneo, int numeroJuego);
    }
}
