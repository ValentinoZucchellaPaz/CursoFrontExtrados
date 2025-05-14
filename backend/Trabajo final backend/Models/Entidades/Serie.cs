namespace Models.Entidades
{
    public class Serie(int id, string nombre, DateTime fecha_salida)
    {
        public required int Id { get; set; } = id;
        public required string Nombre { get; set; } = nombre;
        public required DateOnly FechaSalida { get; set; } = DateOnly.FromDateTime(fecha_salida);
    }
}
