using Models.Entidades;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Models.DTO.Cartas.Response
{
    public class DTOSerie
    {
        public required int Id { get; set; }
        public required string Nombre { get; set; }
        public required DateOnly FechaSalida { get; set; }
        public required IEnumerable<Carta> Cartas { get; set; }
    }
}
