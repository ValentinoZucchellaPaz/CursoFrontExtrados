namespace Models.DTO.Usuarios.Request
{
    public class DTOTokens
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public required DateTime AccessTokenExpiration { get; set; }
        public required DateTime RefreshTokenExpiration { get; set; }
    }
}
