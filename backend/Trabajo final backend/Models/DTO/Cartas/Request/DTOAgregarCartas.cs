namespace Models.DTO.Cartas.Request
{
    public class DTOAgregarCartas
    {
        public required int IdJugador { get; set; }
        public required List<int> Cartas { get; set; }
    }
}
