using Models.Entidades;

namespace Models.DTO.Usuarios.Response
{
    public class DTOUsuarioConIdCreador(int id, string name, string pais, string email, string role, int? idCreador, string? alias, string? avatar)
    {
        public int Id { get; set; } = id;
        public string Name { get; set; } = name;
        public string Pais { get; set; } = pais;
        public string Email { get; set; } = email;
        public string Role { get; set; } = role;
        public int? IdCreador { get; set; } = idCreador;
        public string? Alias { get; set; } = alias;
        public string? Avatar { get; set; } = avatar;

        public static DTOUsuarioConIdCreador FromUsuario(Usuario usuario)
        {
            return new DTOUsuarioConIdCreador(usuario.Id, usuario.Nombre, usuario.Pais, usuario.Email, usuario.Role, usuario.Id_creador, usuario.Alias, usuario.Avatar);
        }
    }
}
