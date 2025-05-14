namespace Models.DTO.Juegos.Request
{
    public class DTOCrearJuego
    {
        public DateTime FechaInicio { get; set; }
        public int NumeroJuego { get; set; }
        public int? JugadorA { get; set; }
        public int? JugadorB { get; set; }
        public bool EsBye { get; set; } = false;
    }
}
