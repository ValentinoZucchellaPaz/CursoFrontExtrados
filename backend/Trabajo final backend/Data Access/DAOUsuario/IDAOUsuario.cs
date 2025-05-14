using Models.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access.DAOUsuario
{
    public interface IDAOUsuario
    {
        public Task<int?> CrearUsuarioAsync(string nombre, string pais, string email, string contraseña, string salt, string role, int? id_creador, string? alias, string? avatar, bool activo);
        public Task<Usuario?> GetUsuarioPorMailAsync(string email);
        public Task<Usuario?> GetUsuarioPorIdAsync(int id);
        public Task<Usuario?> GetUsuarioPorAliasAsync(string alias);
        public Task<IEnumerable<Usuario>> GetUsuariosActivos();
        public Task<IEnumerable<Usuario>> GetUsuariosPorRoles(IEnumerable<UserRole> roles);
        public Task<bool> ActualizarUsuarioAsync(int id, Dictionary<string, object> camposActualizados);
        public Task<bool> BorrarUsuarioAsync(int id);
        public Task<IEnumerable<Usuario>> ValidarIdsJueces(List<int> idsJueces);
    }
}
