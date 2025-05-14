namespace Models.DTO.Juegos.Response
{
    public class DTOJuego
    {
        public DateTime FechaInicio { get; set; }
        public int NumeroJuego { get; set; }
        public int? IdJugadorA { get; set; }
        public int? IdJugadorB { get; set; }
        public int? IdGanador { get; set; }
        public int? IdJuez { get; set; }
    }
}
