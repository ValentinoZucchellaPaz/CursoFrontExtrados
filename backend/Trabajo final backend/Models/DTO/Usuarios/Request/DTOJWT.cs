namespace Models.DTO.Usuarios.Request
{
    public class DTOJWT
    {
        public required string Token { get; set; }
        public required DateTime Expiration { get; set; }
    }
}
