using Models.Entidades;
using Services.Helpers;

namespace Data_Access.DAOUsuario
{
    public class DAOUsuario(DbHelper dbHelper) : IDAOUsuario
    {
        private readonly DbHelper _dbHelper = dbHelper;
        public async Task<int?> CrearUsuarioAsync(string nombre, string pais, string email, string contraseña, string salt, string role, int? id_creador, string? alias, string? avatar, bool activo)
        {
            var query = @"insert into usuarios (nombre, pais, email, contraseña, salt, role, id_creador, alias, avatar, activo)
                        values (@nombre, @pais, @email, @contraseña, @salt, @role, @id_creador, @alias, @avatar, @activo);
                        SELECT LAST_INSERT_ID();";
            var res = await _dbHelper.ExecuteScalarAsync<int>(query, new { nombre, pais, email, contraseña, salt, role, id_creador, alias, avatar, activo });
            return res == 0 ? null : res;
        }

        public async Task<Usuario?> GetUsuarioPorMailAsync(string email)
        {
            var query = "select * from usuarios where email = @email and activo=true";
            return await _dbHelper.QuerySingleOrDefaultAsync<Usuario?>(query, new { email });
        }

        public async Task<Usuario?> GetUsuarioPorIdAsync(int id)
        {
            var query = "select * from usuarios where id=@id and activo=true";
            return await _dbHelper.QuerySingleOrDefaultAsync<Usuario?>(query, new { id });
        }

        public async Task<Usuario?> GetUsuarioPorAliasAsync(string alias)
        {
            var query = "select * from usuarios where alias=@alias and activo=true";
            return await _dbHelper.QuerySingleOrDefaultAsync<Usuario?>(query, new { alias });
        }

        public async Task<IEnumerable<Usuario>> GetUsuariosActivos()
        {
            var query = "select * from usuarios where activo=true";
            return await _dbHelper.QueryAsync<Usuario>(query);
        }

        public async Task<IEnumerable<Usuario>> GetUsuariosPorRoles(IEnumerable<UserRole> roles)
        {
            var rolesString = String.Join(", ", roles.Select(role => $"'{role.ToString()}'")); // "'juez', 'admin', ..." para poner en query
            var query = $"select * from usuarios where role in ({rolesString}) and activo=true";
            return await _dbHelper.QueryAsync<Usuario>(query);
        }

        public async Task<bool> BorrarUsuarioAsync(int id)
        {
            var query = "update usuarios set activo=false where id=@id";
            var res = await _dbHelper.ExecuteAsync(query, new { id });
            return res > 0;
        }

        public async Task<bool> ActualizarUsuarioAsync(int id, Dictionary<string, object> camposActualizados)
        {
            var sets = string.Join(", ", camposActualizados.Select(k => $"{k.Key}=@{k.Key}")); // armar los sets con las props no nulas
            var query = $"update usuarios set {sets} where id=@id;";
            camposActualizados["id"] = id;

            var res = await _dbHelper.ExecuteAsync(query, camposActualizados);
            return res > 0;
        }

        public async Task<IEnumerable<Usuario>> ValidarIdsJueces(List<int> idsJueces)
        {
            string query = "select * from usuarios where role='juez' and id in @idsJueces and activo = true";
            return await _dbHelper.QueryAsync<Usuario>(query, new { idsJueces });
        }
    }
}
