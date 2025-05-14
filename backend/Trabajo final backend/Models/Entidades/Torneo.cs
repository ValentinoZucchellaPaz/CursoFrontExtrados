namespace Models.Entidades
{
    public class Torneo
    {
        public required int Id { get; set; }
        public required DateTime Fecha_inicio { get; set; }
        public required int Cant_dias { get; set; }
        public required int Horas_por_dia {  get; set; }
        public required string Pais { get; set;}
        public required string _fase;
        public string Fase
        {
            get => _fase;
            init
            {
                if (!Enum.TryParse<FasesTorneo>(value, true, out var parsedRole) || !Enum.IsDefined(typeof(FasesTorneo), parsedRole))
                {
                    throw new ArgumentException($"Rol inválido: {value}");
                }
                _fase = value;
            }
        }
        public required int Cant_rondas { get; set; }
        public required int Id_organizador { get; set; }

    }
}
