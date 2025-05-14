using Models.DTO.Juegos.Request;

namespace Models.DTO.Juegos.Response
{
    public class DTOJuegoOficializado
    {
        public bool JuegoOficializado { get; set; }
        public List<DTOActualizarJuego>? JuegosProxRonda { get; set; }
        public int? IdGanadorTorneo { get; set; }
    }
}
