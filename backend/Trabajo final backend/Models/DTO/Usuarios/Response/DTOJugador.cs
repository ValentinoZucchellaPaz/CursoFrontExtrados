using Models.Entidades;

namespace Models.DTO.Usuarios.Response
{
    public class DTOJugador(int id, string alias, string pais, string role, string avatar)
    {
        public int Id { get; set; } = id;
        public string Alias { get; set; } = alias;
        public string Pais { get; set; } = pais;
        public string Role { get; set; } = role;
        public string Avatar { get; set; } = avatar;


        public static DTOJugador FromUsuario(Usuario usuario)
        {
            if ((usuario.Role == UserRole.juez.ToString() || usuario.Role == UserRole.jugador.ToString()) && usuario.Alias != null && usuario.Avatar != null)
            {
                return new DTOJugador(usuario.Id, usuario.Alias, usuario.Pais, usuario.Role, usuario.Avatar);
            }
            throw new ArgumentException("No se puede mapear usuario ya que no es un jugador o juez (o no posee los campos necesarios)");
        }
    }
}
