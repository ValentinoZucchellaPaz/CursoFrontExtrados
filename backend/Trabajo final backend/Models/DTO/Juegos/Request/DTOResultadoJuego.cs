using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Juegos.Request
{
    public class DTOResultadoJuego
    {
        public required int IdTorneo { get; set; }
        public required int NumeroJuego { get; set; }
        public required int IdGanador { get; set; }
        public int? IdDescalificado { get; set; }
        [MaxLength(255)]
        public string? RazonDescalificado { get; set; }
    }
}
