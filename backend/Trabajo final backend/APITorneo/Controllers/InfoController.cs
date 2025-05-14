using Data_Access.DAOUsuario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Entidades;
using Services.UsuarioService;
using System.Security.Claims;
using Models.DTO.Usuarios.Response;
using Models.DTO.Torneos.Response;
using Models.DTO.Juegos.Response;
using Services.InfoService;
using Models.DTO.Cartas.Response;

namespace APITorneo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InfoController(IDAOUsuario dao_usuario, IUsuarioService usuarioService, IInfoService infoService) : Controller
    {
        // esto se tiene que cambiar para usar servicios no el controlador directo
        private readonly IDAOUsuario _daoUsuario = dao_usuario;
        private readonly IUsuarioService _usuarioService = usuarioService;
        private readonly IInfoService _infoService = infoService;

        [HttpGet("cartas")]
        [ProducesResponseType<List<Carta>>(200)]
        public async Task<IActionResult> GetCartas()
        {
            return Ok(await _infoService.GetCartasDisponibles());
        }

        [HttpGet("cartas/{id}")]
        [ProducesResponseType<Carta>(200)]
        public async Task<IActionResult> GetCarta(string id)
        {
            return Ok(await _infoService.GetCarta(id));
        }

        [HttpGet("series")]
        [ProducesResponseType<List<DTOSerie>>(200)]
        public async Task<IActionResult> GetSeries()
        {
            return Ok(await _infoService.GetSeriesDisponibles());
        }

        [HttpGet("series/{id}")]
        [ProducesResponseType<DTOSerie>(200)]
        public async Task<IActionResult> GetSerie(string id)
        {
            return Ok(await _infoService.GetSerie(id));
        }


        // INFO DE TORNEOS: parte publica, debería tener restricciones?
        [HttpGet("torneos")]
        [ProducesResponseType<List<DTOInfoTorneo>>(200)]
        public async Task<IActionResult> GetTorneos()
        {
            return Ok(await _infoService.GetTorneosDisponibles());
        }

        [HttpGet("torneos/{idTorneo}")]
        [ProducesResponseType<DTOInfoTorneo>(200)]
        [EndpointDescription("se retorna toda la información relacionada al torneo")]
        public async Task<IActionResult> GetTorneo(int idTorneo)
        {
            return Ok(await _infoService.GetTorneoPorId(idTorneo));
        }

        [HttpGet("torneo/{idTorneo}/{numeroJuego}")]
        [ProducesResponseType<DTOJuego>(200)]
        public async Task<IActionResult> GetPartidaTorneo(int idTorneo, int numeroJuego)
        {
            return Ok(await _infoService.GetJuegoTorneo(idTorneo, numeroJuego));
        }

        // INFO DE USUARIOS
        [HttpGet("usuarios/jugadores")]
        [Authorize]
        [ProducesResponseType<IEnumerable<DTOJugador>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuarioConIdCreador>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuario>>(200)]
        public async Task<IActionResult> GetJugadores()
        {
            var res = await _daoUsuario.GetUsuariosPorRoles([UserRole.jugador]);
            var userRole = GetUserRoles();
            if(userRole == UserRole.juez || userRole == UserRole.jugador)
            {
                return Ok(res.Select(user=>DTOJugador.FromUsuario(user)));
            }
            if(userRole == UserRole.admin)
            {
                return Ok(res.Select(user=> DTOUsuarioConIdCreador.FromUsuario(user)));
            }
            return Ok(res.Select(user => DTOUsuario.FromUsuario(user)));
        }

        [HttpGet("usuarios/jueces")]
        [Authorize(Roles = "juez, organizador, admin")]
        [ProducesResponseType<IEnumerable<DTOJugador>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuario>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuarioConIdCreador>>(200)]
        public async Task<IActionResult> GetJueces()
        {
            var res = await _daoUsuario.GetUsuariosPorRoles([UserRole.juez]);
            var userRole = GetUserRoles();
            if (userRole == UserRole.juez)
            {
                return Ok(res.Select(user => DTOJugador.FromUsuario(user)));
            }
            if (userRole == UserRole.admin)
            {
                return Ok(res.Select(user => DTOUsuarioConIdCreador.FromUsuario(user)));
            }
            return Ok(res.Select(user => DTOUsuario.FromUsuario(user)));
        }

        [HttpGet("usuarios/organizadores")]
        [Authorize(Roles = "organizador, admin")]
        [ProducesResponseType<IEnumerable<DTOUsuario>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuarioConIdCreador>>(200)]
        public async Task<IActionResult> GetOrganizadores()
        {
            var res = await _daoUsuario.GetUsuariosPorRoles([UserRole.organizador]);
            var userRole = GetUserRoles();
            if (userRole == UserRole.admin)
            {
                return Ok(res.Select(user => DTOUsuarioConIdCreador.FromUsuario(user)));
            }
            return Ok(res.Select(user => DTOUsuario.FromUsuario(user)));
        }

        [HttpGet("usuarios/admins")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType<IEnumerable<DTOUsuarioConIdCreador>>(200)]
        public async Task<IActionResult> GetAdmins()
        {
            var res = await _daoUsuario.GetUsuariosPorRoles([UserRole.admin]);
            return Ok(res.Select(user => DTOUsuarioConIdCreador.FromUsuario(user)));
        }

        [HttpGet("usuarios/all")] // mostrar, segun el rol del jwt, todos los usuarios posibles
        [Authorize]
        [ProducesResponseType<IEnumerable<DTOJugador>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuario>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuarioConIdCreador>>(200)]
        [EndpointDescription("se retorna segun el usuario logeado, todos los usuarios del sistema que puede ver (no puede ver roles con mayor jerarquía)")]
        public async Task<IActionResult> GetUsuarios()
        {
            var userRole = GetUserRoles();
            var res = await _usuarioService.GetUsuariosDisponibles(userRole);
            if (userRole == UserRole.juez || userRole == UserRole.jugador)
            {
                return Ok(res.Select(user => DTOJugador.FromUsuario(user)));
            }
            if (userRole == UserRole.admin)
            {
                return Ok(res.Select(user => DTOUsuarioConIdCreador.FromUsuario(user)));
            }
            return Ok(res.Select(user => DTOUsuario.FromUsuario(user)));
        }

        [HttpGet("usuarios/{id}")]
        [Authorize]
        [ProducesResponseType<IEnumerable<DTOJugador>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuario>>(200)]
        [ProducesResponseType<IEnumerable<DTOUsuarioConIdCreador>>(200)]
        public async Task<IActionResult> GetUsuarioPorId(string id)
        {
            var userRole = GetUserRoles();
            var res = await _usuarioService.GetUsuarioDisponiblePorId(userRole, id);
            if (userRole == UserRole.juez || userRole == UserRole.jugador)
            {
                return Ok(DTOJugador.FromUsuario(res));
            }
            if (userRole == UserRole.admin)
            {
                return Ok(DTOUsuarioConIdCreador.FromUsuario(res));
            }
            return Ok(DTOUsuario.FromUsuario(res));
        }

        private UserRole GetUserRoles()
        {
            var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;
            var roleClaim = claimsIdentity?.FindFirst(ClaimTypes.Role)?.Value;

            if (roleClaim == null || !Enum.TryParse<UserRole>(roleClaim, true, out var userRole))
            {
                throw new Exception("No se pudo determinar el rol del usuario autenticado.");
            }
            return userRole;
        }
    }
}
