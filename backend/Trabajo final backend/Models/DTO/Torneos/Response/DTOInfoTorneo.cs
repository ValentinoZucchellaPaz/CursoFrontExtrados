using Models.DTO.Juegos.Response;
using Models.Entidades;

namespace Models.DTO.Torneos.Response
{
    public class DTOInfoTorneo
    {
        public required Torneo Torneo { get; set; }
        public IEnumerable<int> SeriesPermitidas { get; set; } = [];
        public IEnumerable<int> JuecesOficializadores { get; set; } = [];
        public IEnumerable<InscripcionJugador> JugadoresTorneo { get; set; } = [];

        public IEnumerable<DTOJuego> Juegos { get; set; } = [];

    }
}
