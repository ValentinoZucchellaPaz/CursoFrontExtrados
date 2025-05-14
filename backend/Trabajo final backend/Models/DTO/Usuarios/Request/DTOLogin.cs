using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Usuarios.Request
{
    public class DTOLogin
    {
        [EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
        public required string Email { get; set; }
        public required string Contraseña { get; set; }
    }
}
