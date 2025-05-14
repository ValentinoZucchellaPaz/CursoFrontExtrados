using Models.Entidades;
using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Usuarios.Request
{
    public class DTOSignUp
    {
        [StringLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
        public required string Nombre { get; set; } // que dif hay tener el required aca o como data annotation
        public required string Pais { get; set; }
        [EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
        [RegularExpression(@"^\S*$", ErrorMessage = "No se permiten los espacios")]
        public required string Email { get; set; }
        [StringLength(50, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 50 caracteres.")]
        [RegularExpression(@"^\S*$", ErrorMessage = "No se permiten los espacios")]
        public required string Contraseña { get; set; }
        private string _role;
        public required string Role
        {
            get => _role;
            init
            {
                if (!Enum.TryParse<UserRole>(value, true, out var parsedRole) || !Enum.IsDefined(typeof(UserRole), parsedRole))
                {
                    throw new ArgumentException($"Rol inválido: {value}, los roles son: {string.Join(" | ", Enum.GetNames(typeof(UserRole)))}");
                }
                _role = value;
            }
        }
        [StringLength(50, ErrorMessage = "El alias no puede tener más de 50 caracteres.")]
        public required string? Alias { get; set; }
        [StringLength(100, ErrorMessage = "El url del avatar no puede tener más de 100 caracteres.")]
        public required string? Avatar { get; set; }
    }
}
