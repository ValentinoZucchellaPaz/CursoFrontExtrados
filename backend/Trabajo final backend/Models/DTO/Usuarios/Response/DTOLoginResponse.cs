namespace Models.DTO.Usuarios.Response
{
    public class DTOLoginResponse
    {
        public required string AccessToken { get; set; }
        public required int UserId { get; set; }
        public required string UserEmail { get; set; }
        public required string UserRole { get; set; }

    }
}
