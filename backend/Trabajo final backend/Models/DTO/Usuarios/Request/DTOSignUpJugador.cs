using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Usuarios.Request
{
    public class DTOSignUpJugador
    {
        [StringLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
        public required string Nombre { get; set; }
        public required string Pais { get; set; }
        [EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
        [RegularExpression(@"^\S*$", ErrorMessage = "No se permiten los espacios")]
        public required string Email { get; set; }
        [StringLength(50, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 50 caracteres.")]
        [RegularExpression(@"^\S*$", ErrorMessage = "No se permiten los espacios")]
        public required string Contraseña { get; set; }
        [StringLength(50, ErrorMessage = "El alias no puede tener más de 50 caracteres.")]
        public required string Alias { get; set; }
        [StringLength(100, ErrorMessage = "El url del avatar no puede tener más de 100 caracteres.")]
        public required string Avatar { get; set; }
    }
}
