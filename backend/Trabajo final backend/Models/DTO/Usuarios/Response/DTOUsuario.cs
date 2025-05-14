using Models.Entidades;

namespace Models.DTO.Usuarios.Response
{
    public class DTOUsuario(int id, string name, string pais, string email, string role, string? alias, string? avatar)
    {
        public int Id { get; set; } = id;
        public string Name { get; set; } = name;
        public string Pais { get; set; } = pais;
        public string Email { get; set; } = email;
        public string Role { get; set; } = role;
        public string? Alias { get; set; } = alias;
        public string? Avatar { get; set; } = avatar;

        public static DTOUsuario FromUsuario(Usuario usuario)
        {
            return new DTOUsuario(usuario.Id, usuario.Nombre, usuario.Pais, usuario.Email, usuario.Role, usuario.Alias, usuario.Avatar);
        }
    }
}
