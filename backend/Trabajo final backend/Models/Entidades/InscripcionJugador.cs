namespace Models.Entidades
{
    public class InscripcionJugador
    {
        public int Id_jugador { get; set; }
        public int Id_torneo { get; set; }
        public int Id_Mazo { get; set; }
        public bool? Aceptado { get; set; }
    }
}
