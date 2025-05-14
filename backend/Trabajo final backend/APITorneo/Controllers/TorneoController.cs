using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.DTO.Juegos.Request;
using Models.DTO.Juegos.Response;
using Models.DTO.Torneos.Request;
using Models.DTO.Torneos.Response;
using Models.DTO.Usuarios;
using Models.DTO.Usuarios.Request;
using Models.Entidades;
using Services.TorneoService;
using System.Security.Claims;

namespace APITorneo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TorneoController(ITorneoService torneoService) : Controller
    {
        private readonly ITorneoService _torneoService = torneoService;

        [HttpPost("crear")]
        [Authorize(Roles = "organizador")]
        [ProducesResponseType<DTOResultadosCreacionTorneo>(200)]
        public async Task<IActionResult> CrearTorneo(DTOCrearTorneo request)
        {
            // crea torneo, sube series permitidas, jueces oficializadores
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Devuelve errores de validación
            var creador = GetInfoCreador();
            var res = await _torneoService.CrearTorneo(request, creador);
            return Ok(res);
        }

        [HttpPost("inscribir-jugador")]
        [Authorize(Roles = "jugador")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public async Task<IActionResult> InscribirJugador(DTOInscribirJugador request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Devuelve errores de validación
            var jugador = GetInfoCreador();
            var jugadorInscripto = await _torneoService.InscribirJugador(request, jugador);

            return jugadorInscripto ? NoContent() : BadRequest("ocurrio un error inscribiendo jugador");
        }

        [HttpPost("comenzar/{idTorneo}")]
        [Authorize(Roles = "organizador")]
        [ProducesResponseType<DTOComienzoTorneo>(200)]
        [EndpointDescription("si torneo esta lleno se aceptan usuarios en espera, se puede comenzar los juegos (se hacen parejas de la primera ronda)")]
        public async Task<IActionResult> ComenzarTorneo(int idTorneo, [FromBody] bool force = false)
        {
            // si torneo esta lleno se aceptan usuarios en espera, pasa a sig fase (se hacen matchups)
            var creador = GetInfoCreador();
            var (juegos, nuevaCantRondas) = await _torneoService.ComenzarTorneo(idTorneo, creador, force);

            return Ok(new DTOComienzoTorneo() { IdTorneo=idTorneo, NuevaCantRondas = nuevaCantRondas, Juegos=juegos });
        }

        [HttpPost("oficializar")]
        [Authorize(Roles = "juez")]
        [ProducesResponseType<DTOJuegoOficializado>(200)]
        [ProducesResponseType(400)]
        [EndpointDescription("Se pone el resultado del juego, si termina el torneo o la ronda se devuelven el ganador o los juegos de la nueva ronda")]
        public async Task<IActionResult> OficializarJuego (DTOResultadoJuego request)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState); // Devuelve errores de validación
            var creador = GetInfoCreador();
            var juegoOficializado = await _torneoService.OficializarJuego(request, creador);

            return juegoOficializado.JuegoOficializado ? Ok(juegoOficializado) : BadRequest("Ocurrio un error oficializando el juego");
        }

        [HttpPost("editar/{idTorneo}")]
        [Authorize("organizador")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [EndpointDescription("Elimina los anteriores jueces (o series) del torneo y agrega la nueva lista que se le pasa (las series son opcionales)")]
        public async Task<IActionResult> EditarTorneo(int idTorneo, [FromBody] DTOEditarTorneo request)
        {
            //que debo poder editar aca? fechas, jueces, series algo mas?
            // tiempo NO, series y jueces
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var editado = await _torneoService.EditarTorneo(idTorneo, request);
            
            return editado ? NoContent() : BadRequest("algo ha salido mal actualizando el torneo");
        }

        [HttpPatch("editar-juego/{idTorneo}/{numeroJuego}")]
        [Authorize(Roles = "organizador")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [EndpointDescription("si el juego aun no se jugó se pueden cambiar sus jugadores por otros, si el juego ya se jugó se puede cambiar el ganador, si el juego está creado pero es de una ronda por venir no se puede cambiar")]
        public async Task<IActionResult> EditarJuego(int idTorneo, int numeroJuego, [FromBody] DTOEditarJuego request)
        {
            var editado = await _torneoService.EditarJuego(idTorneo, numeroJuego, request);
            return editado ? NoContent() : BadRequest($"No se pudo editar el juego {numeroJuego} del torneo {idTorneo}");
        }

        [HttpPost("rechazar-inscripcion/{idTorneo}/{idJugador}")]
        [Authorize(Roles = "organizador")]
        [ProducesResponseType(204)]
        public async Task<IActionResult> RechazarInscripcion(int idTorneo, int idJugador)
        {
            await _torneoService.RechazarInscripcionJugador(idTorneo, idJugador);
            return NoContent();
        }

        [HttpPost("cancelar/{idTorneo}")]
        [Authorize(Roles = "admin,organizador")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CancelarTorneo(int idTorneo) 
        {
            // cambiar flag de torneo a cancelado
            var creador = GetInfoCreador();
            var res = await _torneoService.CancelarTorneo(idTorneo, creador);
            return res ? Ok("torneo cancelado") : BadRequest("No se pudo cancelar");
        }

        private DTOUserClaims GetInfoCreador()
        {
            var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;
            var idClaim = claimsIdentity?.FindFirst(ClaimTypes.Sid)?.Value;
            var emailClaim = claimsIdentity?.FindFirst(ClaimTypes.Email)?.Value;
            var roleClaim = claimsIdentity?.FindFirst(ClaimTypes.Role)?.Value;

            if (idClaim == null || emailClaim == null || roleClaim == null || !Enum.TryParse<UserRole>(roleClaim, out var userRole) || !int.TryParse(idClaim, out int id))
            {
                throw new Exception("No se pudo determinar la informacion del usuario autenticado.");
            }
            return new DTOUserClaims()
            {
                Id = id,
                Email = emailClaim,
                Role = userRole,
            };
        }
    }
}
