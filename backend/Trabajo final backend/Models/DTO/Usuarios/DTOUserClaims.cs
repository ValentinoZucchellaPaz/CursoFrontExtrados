using Models.Entidades;
namespace Models.DTO.Usuarios
{
    public class DTOUserClaims
    {
        public required int Id { get; set; }
        public required string Email { get; set; }
        public required UserRole Role { get; set; }
    }
}
