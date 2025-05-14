using Models.DTO.Cartas.Response;
using Models.DTO.Usuarios;
using Models.DTO.Usuarios.Request;
using Models.Entidades;

namespace Services.UsuarioService
{
    public interface IUsuarioService
    {
        /// <summary>
        /// Verifica que el mail y la contraseña del usuario son validos
        /// </summary>
        /// <param name="request">Objeto con informacion del usuario</param>
        /// <exception cref="UnauthorizedAccessException">No existe usuario o contraseña es invalida</exception>
        /// <returns>El usuario en db</returns>
        public Task<Usuario> Authenticate(DTOLogin request);
        /// <summary>
        /// Crea un jugador en la db, hashea contraseña antes de subir
        /// </summary>
        /// <param name="request">Objeto con informacion de creacion del jugador</param>
        /// <exception cref="InvalidOperationException">Fallas en la creacion del usuario en db</exception>
        /// <returns>Id del jugador creado</returns>
        public Task<int> CrearJugador(DTOSignUpJugador request);
        /// <summary>
        /// Crea un usuario en la db, hashea contraseña antes de subir
        /// </summary>
        /// <param name="request">Objeto con informacion de creacion del usuario</param>
        /// <param name="creador">Objeto con informacion del creador del usuario</param>
        /// <exception cref="ArgumentException">Rol invalido o falta de datos para juez</exception>
        /// <exception cref="InvalidOperationException">Falla en crear el usuario en db</exception>
        /// <exception cref="UnauthorizedAccessException">Problema entre roles creador y creado</exception>
        /// <returns>Id del usuario creado en db</returns>
        public Task<int> CrearUsuario(DTOSignUp request, DTOUserClaims creador);
        /// <summary>
        /// Edita campos de un usuario en db, solo acepta campos distintos a los de db
        /// </summary>
        /// <param name="id">Id del usuario a editar</param>
        /// <param name="camposActualizados">Objeto con informacion de campos del usuario</param>
        /// <exception cref="KeyNotFoundException">No se encontró usuario en db</exception>
        /// <exception cref="ArgumentException">Campos tienen mismo valor que en db</exception>
        public Task<bool> EditarUsuario(int id, DTOActualizarUsuario camposActualizados);
        /// <summary>
        /// Borrado logico de un usuario en db
        /// </summary>
        /// <param name="id">Id del usuario a borrar</param>
        public Task<bool> BorrarUsuario(int id);
        /// <summary>
        /// Obtiene los usuarios que puede ver el rol de params
        /// </summary>
        /// <param name="userRole">Rol del usuario que manda la request</param>
        /// <returns>Usuarios disponibles</returns>
        public Task<IEnumerable<Usuario>> GetUsuariosDisponibles(UserRole userRole);
        /// <summary>
        /// Obtiene el usuario con esa key (id, email, alias) si esta disponible para el rol de params
        /// </summary>
        /// <param name="requestRole">Rol del usuario que manda la request</param>
        /// <param name="key">Id, email o alias del usuario a buscar</param>
        /// <exception cref="KeyNotFoundException">Usuario no encontrado en db</exception>
        /// <exception cref="ArgumentException">Rol del usuario en db incorrecto</exception>
        /// <exception cref="UnauthorizedAccessException">requestRole no tiene acceso a ese usuario</exception>
        /// <returns>Usuario buscado</returns>
        public Task<Usuario> GetUsuarioDisponiblePorId(UserRole requestRole, string key);
        /// <summary>
        /// Devuelve la coleccion de cartas de ese jugador
        /// </summary>
        /// <param name="userId">Id del jugador</param>
        public Task<IEnumerable<Carta>> GetColeccion(int userId);
        /// <summary>
        /// Devuelve los mazos de ese jugador
        /// </summary>
        /// <param name="userId">Id del jugador</param>
        public Task<IEnumerable<DTOMazo>> GetMazos(int userId);
        /// <summary>
        /// Devuelve el mazo con ese id de ese jugador
        /// </summary>
        /// <param name="userId">Id del jugador</param>
        /// <param name="mazoId">Id del mazo</param>
        public Task<IEnumerable<Carta>> GetMazoPorId(int userId, int mazoId);
        /// <summary>
        /// Agregar cartas a la coleccion de ese jugador
        /// </summary>
        /// <param name="userId">Id del jugador</param>
        /// <param name="cartasIds">Lista con los id de las cartas a agregar</param>
        /// <exception cref="ArgumentException">Se pasa una lista de ids vacia</exception>
        /// <returns>Número de cartas agregadas a db</returns>
        public Task<int> AgregarAColeccion(int userId, List<int> cartasIds);
        /// <summary>
        /// Agregar un nuevo mazo a nombre de ese jugador
        /// </summary>
        /// <param name="userId">Id del jugador</param>
        /// <param name="cartasIds">Lista con los id de las cartas a agregar</param>
        /// <exception cref="ArgumentException">No se pasan las 15 cartas que lleva un mazo</exception>
        /// <exception cref="KeyNotFoundException">No se encontró una coleccion a nombre de ese usuario</exception> 
        /// <exception cref="InvalidOperationException">Las cartas de la lista no pertenecen a la coleccion del usuario</exception>
        /// <returns>Número de cartas agregadas a db</returns>
        public Task<(int, int)> AgregarMazo(int userId, List<int> cartasIds);
        /// <summary>
        /// Metodo auxiliar para conocer los roles que puede buscar un determinado rol
        /// </summary>
        /// <param name="rolActual">Rol que quiere realizar la busqueda</param>
        /// <returns>Lista de roles que puede buscar</returns>
        public IEnumerable<UserRole> BusquedaPermitidaPorRol(UserRole rolActual);
    }
}
