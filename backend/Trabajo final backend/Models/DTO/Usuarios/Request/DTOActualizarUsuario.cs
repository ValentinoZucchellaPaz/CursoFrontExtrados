using Models.Entidades;
using System.ComponentModel.DataAnnotations;

namespace Models.DTO.Usuarios.Request
{
    public class DTOActualizarUsuario
    {
        [StringLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
        public string? Nombre { get; set; }
        public string? Pais { get; set; }
        [EmailAddress(ErrorMessage = "El email no tiene un formato válido.")]
        [RegularExpression(@"^\S*$", ErrorMessage = "No se permiten los espacios")]
        public string? Email { get; set; }
        [StringLength(50, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 50 caracteres.")]
        [RegularExpression(@"^\S*$", ErrorMessage = "No se permiten los espacios")]
        public string? Contraseña { get; set; }
        private string? _role;
        public string? Role
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
        public string? Alias { get; set; }
        public string? Avatar { get; set; }
        public bool? Activo { get; set; }
    }
}
