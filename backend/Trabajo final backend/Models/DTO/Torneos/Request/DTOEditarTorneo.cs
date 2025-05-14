using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Torneos.Request
{
    public class DTOEditarTorneo
    {
        public required List<int>? NuevosJueces;
        public List<int>? NuevasSeriesCartas { get; set; }
    }
}
