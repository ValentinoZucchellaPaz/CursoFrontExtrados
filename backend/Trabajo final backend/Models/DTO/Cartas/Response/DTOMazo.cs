namespace Models.DTO.Cartas.Response
{
    public class DTOMazo
    {
        public required int Id { get; set; }
        public required List<string> Cartas { get; set; }
    }
}
