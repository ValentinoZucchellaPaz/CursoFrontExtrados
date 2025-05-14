using Data_Access.DAOCartas;
using Data_Access.DAOTorneo;
using Data_Access.DAOUsuario;
using Models.DTO.Cartas.Response;
using Models.DTO.Juegos.Response;
using Models.DTO.Torneos.Response;
using Models.Entidades;

namespace Services.InfoService
{
    public class InfoService(IDAOCartas daoCartas, IDAOUsuario daoUsuario, IDAOTorneo daoTorneo) : IInfoService
    {
        private readonly IDAOUsuario _daoUsuario = daoUsuario;
        private readonly IDAOTorneo _daoTorneo = daoTorneo;
        private readonly IDAOCartas _daoCartas = daoCartas;
        public async Task<List<Carta>> GetCartasDisponibles()
        {
            var cartas = await _daoCartas.GetCartasAsync();
            return cartas.ToList();
        }
        public async Task<Carta> GetCarta(string id)
        {
            if (int.TryParse(id, out int value))
            {
                return await _daoCartas.GetCartaByIdAsync(value)
                    ?? throw new KeyNotFoundException($"No se encontró la carta {value}");
            }
            else
            {
                return await _daoCartas.GetCartaByNameAsync(id)
                    ?? throw new KeyNotFoundException($"No se encontró la carta {id}");
            }
        }
        public async Task<List<DTOSerie>> GetSeriesDisponibles()
        {
            List<DTOSerie> dtos = [];
            var series = await _daoCartas.GetSeriesAsync();
            foreach (var serie in series)
            {
                DTOSerie dto = new()
                {
                    Id = serie.Id,
                    Nombre = serie.Nombre,
                    FechaSalida = serie.FechaSalida,
                    Cartas = await _daoCartas.GetSerieCardsAsync(serie.Id),
                };
                dtos.Add(dto);
            }

            return dtos;
        }
        public async Task<DTOSerie> GetSerie(string id)
        {
            Serie serie;
            if (int.TryParse(id, out int value))
            {
                serie = await _daoCartas.GetSerieByIdAsync(value)
                    ?? throw new KeyNotFoundException($"No se encontró la serie {value}");
            }
            else
            {
                serie = await _daoCartas.GetSerieByNameAsync(id) ?? throw new KeyNotFoundException($"No se encontró la serie {id}");
            }
            return new DTOSerie()
            {
                Id = serie.Id,
                Nombre = serie.Nombre,
                FechaSalida = serie.FechaSalida,
                Cartas = await _daoCartas.GetSerieCardsAsync(serie.Id),
            };
        }
        public async Task<List<DTOInfoTorneo>> GetTorneosDisponibles()
        {
            List<DTOInfoTorneo> dtos = [];
            var torneos = await _daoTorneo.GetTorneosAsync();
            foreach (var torneo in torneos)
            {
                dtos.Add(await GetTorneoPorId(torneo.Id));
            }
            return dtos;
        }
        public async Task<DTOInfoTorneo> GetTorneoPorId(int idTorneo)
        {
            DTOInfoTorneo res = new()
            {
                Torneo = await _daoTorneo.GetTorneoByIdAsync(idTorneo)
                    ?? throw new KeyNotFoundException($"No se encontro el torneo {idTorneo}"),
                JuecesOficializadores = await _daoTorneo.GetJuecesTorneoAsync(idTorneo),
                JugadoresTorneo = await _daoTorneo.GetInscripcionesAsync(idTorneo),
            };
            var juegos = await _daoTorneo.GetJuegosDeTorneoAsync(idTorneo);
            res.Juegos = juegos.Select(x => new DTOJuego()
            {
                FechaInicio = x.Fecha_inicio,
                NumeroJuego = x.Numero_juego,
                IdJugadorA = x.Id_jugador_a,
                IdJugadorB = x.Id_jugador_b,
                IdGanador = x.Id_ganador,
                IdJuez = x.Id_juez
            });
            var seriesDeTorneo = await _daoTorneo.GetSeriesTorneoAsync(idTorneo);
            res.SeriesPermitidas = seriesDeTorneo.Select(s => s.Id_serie);

            return res;
        } 
        public async Task<DTOJuego> GetJuegoTorneo(int idTorneo, int numeroJuego)
        {
            Juego x = await _daoTorneo.GetJuegoDeTorneoPorIdAsync(idTorneo, numeroJuego) ?? throw new KeyNotFoundException("No se ha encontrado el recurso en db");
            return new DTOJuego()
            {
                FechaInicio = x.Fecha_inicio,
                NumeroJuego = x.Numero_juego,
                IdJugadorA = x.Id_jugador_a,
                IdJugadorB = x.Id_jugador_b,
                IdGanador = x.Id_ganador,
                IdJuez = x.Id_juez
            };
        }
    }
}
