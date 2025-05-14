namespace Models.Entidades
{
    public class Juego
    {
        public int Id { get; set; }
        public DateTime Fecha_inicio { get; set; }
        public int? Id_juez { get; set; }
        public int Id_torneo { get; set; }
        public int Numero_juego { get; set; }
        public int? Id_jugador_a { get; set; }
        public int? Id_jugador_b { get; set; }
        public int? Id_ganador { get; set; }
    }
}
