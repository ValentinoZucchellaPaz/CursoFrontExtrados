using Data_Access.DAOUsuario;
using Data_Access.DAOCartas;
using Microsoft.IdentityModel.Tokens;
using Models.Entidades;
using Services.Helpers;
using Services.Security;
using System.Reflection;
using Models.DTO.Usuarios.Request;
using Models.DTO.Cartas.Response;
using Models.DTO.Usuarios;

namespace Services.UsuarioService
{
    public class UsuarioService(IDAOUsuario daoUsuario, IDAOCartas daoCartas): IUsuarioService
    {
        private readonly IDAOUsuario _daoUsuario = daoUsuario;
        private readonly IDAOCartas _daoCartas = daoCartas;


        // AUTENTICAR Y CREAR USUARIO
        public async Task<Usuario> Authenticate(DTOLogin request)
        {
            var user = await _daoUsuario.GetUsuarioPorMailAsync(request.Email);
            if (user == null || !PasswordHasher.VerifyPassword(request.Contraseña, user.Contraseña, user.Salt))
                throw new UnauthorizedAccessException($"El mail {request.Email} o la contraseña son incorrectos");
            return user;
        }


        public async Task<int> CrearJugador(DTOSignUpJugador request)
        {
            // hashear pass
            (string pass, string salt) = PasswordHasher.HashPassword(request.Contraseña);
            //subir a db y devolver la id
            var idJugador = await _daoUsuario.CrearUsuarioAsync(request.Nombre, request.Pais, request.Email, pass, salt, UserRole.jugador.ToString(), null, request.Alias, request.Avatar, true)
                ?? throw new InvalidOperationException("falló la creacion del usuario");
            return idJugador;
        }

        public async Task<int> CrearUsuario(DTOSignUp request, DTOUserClaims creador)
        {
            // validaciones de role
            if (!Enum.TryParse<UserRole>(request.Role, true, out var parsedRole) || !Enum.IsDefined(typeof(UserRole), parsedRole))
                throw new ArgumentException($"Rol inválido: {request.Role}, los roles son: {String.Join(" | ", Enum.GetNames(typeof(UserRole)))}");
            if ((parsedRole >= creador.Role && creador.Role != UserRole.admin) || 
                (creador.Role == UserRole.organizador && parsedRole == UserRole.jugador)) // no se permite que un usuario cree otro con mayor nivel o mismo (except admin) ni que un org cree un jugador
                throw new UnauthorizedAccessException($"Problema de roles: un {creador.Role} no puede crear a un {request.Role}");
            if (parsedRole == UserRole.juez && (request.Alias == null || request.Avatar == null))
                throw new ArgumentException("El juez necesita alias y avatar");

            // hashear pass
            (string pass, string salt) = PasswordHasher.HashPassword(request.Contraseña);
            //subir a db y devolver la id
            var idUsuario = await _daoUsuario.CrearUsuarioAsync(request.Nombre, request.Pais, request.Email, pass, salt, request.Role, creador.Id, request.Alias, request.Avatar, true)
                ?? throw new InvalidOperationException("no se pudo crear el usuario");
            return idUsuario;
        }

        public async Task<bool> EditarUsuario(int id, DTOActualizarUsuario camposActualizados)
        {
            var usuarioDb = await GetUsuarioDisponiblePorId(UserRole.admin, id.ToString()) 
                ?? throw new KeyNotFoundException($"No se encontro el usuario con id {id}");

            // validar que el campo a editar no sea igual al que hay en db
            var propsPublicasDto = typeof(DTOActualizarUsuario).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var propDto in propsPublicasDto)
            {
                var valorDto = propDto.GetValue(camposActualizados);
                if (valorDto == null) continue;
                var propUsuario = typeof(Usuario).GetProperty(propDto.Name, BindingFlags.Public | BindingFlags.Instance);
                if (propUsuario == null) continue;
                var valorUsuario = propUsuario.GetValue(usuarioDb);
                if (Equals(valorDto, valorUsuario)) throw new ArgumentException($"El campo {propDto.Name}={valorDto} tiene el mismo valor que el actual, para editar un usuario pasa valores distintos");
            }

            // pasar dto a dict
            var camposActualizadosDict = ReflectionHelper.FromModelToDictionary(camposActualizados);

            //verificar si hay cambio de contraseña y hashearla
            if (camposActualizados.Contraseña != null)
            {
                var (hash, salt) = PasswordHasher.HashPassword(camposActualizados.Contraseña);
                camposActualizadosDict["contraseña"] = hash;
                camposActualizadosDict["salt"] = salt;
            }

            return await _daoUsuario.ActualizarUsuarioAsync(id, camposActualizadosDict);
        }

        // BORRADO LOGICO DE USUARIO
        public async Task<bool> BorrarUsuario(int id)
        {
            return await _daoUsuario.BorrarUsuarioAsync(id);
        }

        // DEVOLVER INFO DE USUARIO
        public async Task<IEnumerable<Usuario>> GetUsuariosDisponibles(UserRole userRole)
        {
            var rolesPermitidos = BusquedaPermitidaPorRol(userRole);
            return await _daoUsuario.GetUsuariosPorRoles(rolesPermitidos);
        }

        public async Task<Usuario> GetUsuarioDisponiblePorId(UserRole requestRole, string key)
        {
            var rolesPermitidos = BusquedaPermitidaPorRol(requestRole);
            Usuario usuario;
            if (int.TryParse(key, out int value))
            {
                usuario = await _daoUsuario.GetUsuarioPorIdAsync(value) 
                    ?? throw new KeyNotFoundException($"No existen usuarios con id {key}");
            }
            else
            {
                if (key.Contains("@gmail.com"))
                {
                    usuario = await _daoUsuario.GetUsuarioPorMailAsync(key) 
                        ?? throw new KeyNotFoundException($"no existe un usuario con mail {key}");
                }

                usuario = await _daoUsuario.GetUsuarioPorAliasAsync(key)
                    ?? throw new KeyNotFoundException($"no existe un usuario con alias {key}");
            }

            // validar que el rol del usuario buscado esta entre rolesPermitidos
            if(!Enum.TryParse<UserRole>(usuario.Role, out var userRole))
                throw new ArgumentException("El rol del usuario de la db es incorrecto");
            else if (!rolesPermitidos.Contains(userRole))
                throw new UnauthorizedAccessException("No tienes acceso para ver este usuario");
            return usuario;
        }

        // VER COLECCION Y MAZOS
        public async Task<IEnumerable<Carta>> GetColeccion(int userId)
        {
            var cartasDeUsuarioId = await _daoCartas.GetColeccionAsync(userId);
            // recuperar las cartas por su id y devolver todas juntas
            var cartasConNulos = await Task.WhenAll(
                cartasDeUsuarioId.Select(async cdu=> await _daoCartas.GetCartaByIdAsync(cdu.Id_carta))
            );
            return cartasConNulos.Where(c=>c!=null).Cast<Carta>();
        }
        public async Task<IEnumerable<DTOMazo>> GetMazos(int userId)
        {
            var mazosResponse = new List<DTOMazo>();
            var mazos = await _daoCartas.GetMazosAsync(userId);
            if (mazos.IsNullOrEmpty()) throw new KeyNotFoundException($"No se encontraron los mazos del usuario con id {userId}");
            foreach(var mazo in mazos)
            {
                var cartasMazo = await GetMazoPorId(userId, mazo.Id);
                mazosResponse.Add(new DTOMazo() { Id = mazo.Id, Cartas = cartasMazo.Select(carta => carta.Nombre).ToList() });
            }
            return mazosResponse;
        }
        public async Task<IEnumerable<Carta>> GetMazoPorId(int userId, int mazoId)
        {
            // validar que el mazoId es un mazo de ese usuario
            var mazosUsuario = await _daoCartas.GetMazosAsync(userId);
            if (mazosUsuario.IsNullOrEmpty()) throw new KeyNotFoundException("No se encontro el mazo que quieres buscar");
            if (!mazosUsuario.Any(m => m.Id == mazoId)) throw new UnauthorizedAccessException("El mazo que quieres buscar no te pertenece");
            var cartasDeMazo = await _daoCartas.GetMazoPorIdAsync(mazoId);

            // recuperar las cartas por su id y devolver todas juntas
            var cartasConNulos = await Task.WhenAll(
                cartasDeMazo.Select(async cdm => await _daoCartas.GetCartaByIdAsync(cdm.Id_carta))
            );
            return cartasConNulos.Where(c => c != null).Cast<Carta>();
        }

        // CARGAR COLECCION Y MAZOS
        public async Task<int> AgregarAColeccion(int userId, List<int> cartasIds)
        {
            // validar que cartasIds no este vacia y contenga ids de cartas de la db (db lanzará excepcion)
            if (cartasIds.IsNullOrEmpty()) throw new ArgumentException("debes pasar una lista de cartas");

            // validar que no agregue cartas repetidas
            var coleccionUsuario = await _daoCartas.GetColeccionAsync(userId);
            if (!coleccionUsuario.IsNullOrEmpty())
            {
                // agregar cartas sin repetir
                var idsSinRepetir = cartasIds
                    .Where(idCarta => !coleccionUsuario.Any(cdu => cdu.Id_carta == idCarta))
                    .ToList();
                return await _daoCartas.AgregarCartasAColeccionAsync(userId, idsSinRepetir);
            }

            // registrar coleccion desde cero
            return await _daoCartas.AgregarCartasAColeccionAsync(userId, cartasIds);
        }
        public async Task<(int, int)> AgregarMazo(int userId, List<int> cartasIds)
        {
            // validar que el mazo a registrar tenga 15 cartas no repetidas
            if (cartasIds.Count() != 15) 
                throw new ArgumentException("Cada mazo debe tener 15 cartas");
            // validar que las cartas pertenecen a la coleccion del usuario
            var cartasDeColeccion = await _daoCartas.GetColeccionAsync(userId);
            if (cartasDeColeccion.IsNullOrEmpty()) 
                throw new KeyNotFoundException("El jugador no tiene una coleccion registrada");
            if (!cartasIds.All(id => cartasDeColeccion.Any(cdc => cdc.Id_carta == id))) 
                throw new InvalidOperationException("Todas las cartas que se quieren agregar al mazo deben pertenecer a la coleccion del usuario");
            
            // crear mazo en db y subir cartas
            var idMazo = await _daoCartas.RegistrarMazoAsync(userId);
            var cartasAgregadas = await _daoCartas.AgregarAMazoAsync(idMazo, cartasIds);
            return (idMazo,cartasAgregadas);
        }

        // metodo auxiliar para ver que roles puede buscar el rol determinado
        public IEnumerable<UserRole> BusquedaPermitidaPorRol(UserRole rolActual)
        {
            // Filtrar los roles que están en la misma jerarquía o por debajo
            return Enum.GetValues(typeof(UserRole))
                .Cast<UserRole>()
                .Where(r => r <= rolActual);
        }
    }
}
