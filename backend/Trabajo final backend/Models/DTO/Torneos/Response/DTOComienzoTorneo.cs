using Models.DTO.Juegos.Request;

namespace Models.DTO.Torneos.Response
{
    public class DTOComienzoTorneo
    {
        public int IdTorneo { get; set; }
        public int? NuevaCantRondas { get; set; }
        public IEnumerable<DTOCrearJuego> Juegos { get; set; } = [];
    }
}
