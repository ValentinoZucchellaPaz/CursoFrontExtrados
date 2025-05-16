using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Models.DTO.Cartas.Response;
using Models.DTO.Usuarios;
using Models.DTO.Usuarios.Request;
using Models.DTO.Usuarios.Response;
using Models.Entidades;
using Services.AuthService;
using Services.UsuarioService;
using System.Data;
using System.Security.Claims;

namespace APITorneo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController(IUsuarioService user_service, IAuthService auth_service) : Controller
    {
        private readonly IUsuarioService _userService = user_service;
        private readonly IAuthService _authService = auth_service;

        [HttpPost("login")]
        [ProducesResponseType<DTOLoginResponse>(200)]
        public async Task<IActionResult> Login(DTOLogin request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Devuelve errores de validación

            // validar mail y contraseña, generar y devolver access token y cookie con refresh token
            var user = await _userService.Authenticate(request);
            if(user == null) return Unauthorized("mail o contraseña incorrectos");

            DTOJWT accessToken = _authService.GenerateAccessToken(user.Id, user.Email, user.Role);
            DTOJWT refreshToken = await _authService.GenerateRefreshToken(user.Id, user.Email, user.Role);

            DTOLoginResponse res = new()
            {
                AccessToken = accessToken.Token,
                UserId = user.Id,
                UserEmail = user.Email,
                UserRole = user.Role,
            };

            Response.Cookies.Append("torneo-refresh-token", $"{user.Id}:{refreshToken.Token}", new CookieOptions()
            {
                Secure = true,
                Expires = refreshToken.Expiration,
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
            });

            return Ok(res);
        }

        [HttpPost("refresh-token")]
        [ProducesResponseType(401)]
        [ProducesResponseType<DTOLoginResponse>(200)]
        [EndpointDescription("Valida que le llegué una cookie con el refresh-token, valida este y crea uno nuevo (borra anterior), devuelve cookie con nuevo refresh y un nuevo access token valido")]
        public async Task<IActionResult> Refresh()
        {
            //recupero valor de cookie
            if (!Request.Cookies.TryGetValue("torneo-refresh-token", out var refreshTokenCookie) || refreshTokenCookie.IsNullOrEmpty())
                return Unauthorized("No se encontró ningun refresh token, haga un login");

            var parts = refreshTokenCookie.Split(":"); //valido que tenga el id y el refresh token
            if (parts.Length != 2)
                return Unauthorized("Formato de refresh token invalido, haga un login");

            var userId = int.Parse(parts[0]);
            string refreshToken = parts[1] ?? throw new ArgumentNullException("Refresh token es null");

            var isValid = await _authService.ValidarRefreshToken(userId, refreshToken);

            if (!isValid) return Unauthorized("RefreshToken no valido");

            var usuario = await _userService.GetUsuarioDisponiblePorId(UserRole.admin, userId.ToString())
                ?? throw new UnauthorizedAccessException($"El usuario con id {userId} no existe");


            var accessToken = _authService.GenerateAccessToken(userId, usuario.Email, usuario.Role);

            return Ok(new DTOLoginResponse() { 
                AccessToken=accessToken.Token,
                UserEmail=usuario.Email,
                UserId=usuario.Id,
                UserRole=usuario.Role,
            });
        }

        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(204)]
        [EndpointDescription("Valida que le llegué una cookie con el refresh-token, borra token en db y borra cookie al usuario")]
        public async Task<IActionResult> Logout()
        {
            //recupero valor de cookie
            if (!Request.Cookies.TryGetValue("torneo-refresh-token", out var refreshTokenCookie) || refreshTokenCookie.IsNullOrEmpty())
                return NoContent();

            var parts = refreshTokenCookie.Split(":");
            if (parts.Length != 2) return NoContent();

            var userId = int.Parse(parts[0]);
            string refreshToken = parts[1];
            if(refreshToken == null) return NoContent();

            // elimino de db
            var res = await _authService.BorrarRefreshToken(userId, refreshToken);
            if (!res) throw new DBConcurrencyException("hubo problemas para cerrar la sesion");

            //elimino cookie y devuelvo data
            Response.Cookies.Append("torneo-refresh-token", "", new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddDays(-1)
            });

            return NoContent();
        }

        [HttpPost("sign-up")]
        [Authorize(Roles = "organizador, admin")]
        [EndpointDescription("Guarda en db el nuevo usuario junto a su id creador y retorna el id del usuario creado, los admin pueden crear cualquier usuario pero los organizadores solo jueces (jugadores y jueces no pueden crear usuarios)")]
        [ProducesResponseType<int>(200)]
        public async Task<IActionResult> CrearUsuario(DTOSignUp request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Devuelve errores de validación
            var creador = GetInfoCreador();
            var userId = await _userService.CrearUsuario(request, creador);
            return Ok(userId);
        }

        [HttpPost("sign-up-jugador")] //solo se pueden crear jugadores
        [ProducesResponseType<int>(200)]
        [EndpointDescription("Retorna el id del jugador creado")]
        public async Task<IActionResult> CrearJugador(DTOSignUpJugador request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Devuelve errores de validación
            var res = await _userService.CrearJugador(request);
            return Ok(res);
        }

        [HttpPatch("editar/{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [EndpointDescription("Edita todos los campos de un usuario de manera opcional")]
        public async Task<IActionResult> EditarUsuario(int id, [FromBody] DTOActualizarUsuario camposActualizados)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Devuelve errores de validación
            var edited = await _userService.EditarUsuario(id, camposActualizados);
            
            return edited ? NoContent() : BadRequest("No se pudo editar correctamente el usuario");
        }

        [HttpPost("borrar/{id}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> BorrarUsuario(int id)
        {
            var res = await _userService.BorrarUsuario(id);
            return res ? NoContent() : BadRequest("no se pudo eliminar ese usuario");
        }

        // METODOS DEL JUGADOR PARA VER SUS CARTAS
        [HttpGet("coleccion")]
        [Authorize(Roles="jugador")]
        [ProducesResponseType<IEnumerable<Carta>>(200)]
        public async Task<IActionResult> GetColeccion()
        {
            var creador = GetInfoCreador();
            var res = await _userService.GetColeccion(creador.Id);
            return Ok(res);
        }

        [HttpGet("mazos")]
        [Authorize(Roles = "jugador")]
        [ProducesResponseType<IEnumerable<DTOMazo>>(200)]
        public async Task<IActionResult> GetMazos()
        {
            var creador = GetInfoCreador();
            var res = await _userService.GetMazos(creador.Id);
            return Ok(res);
        }

        [HttpGet("mazos/{id}")]
        [Authorize(Roles = "jugador")]
        [ProducesResponseType<IEnumerable<Carta>>(200)]
        public async Task<IActionResult> GetMazoPorId(int id)
        {
            var creador = GetInfoCreador();
            var res = await _userService.GetMazoPorId(creador.Id, id);
            return Ok(res);
        }

        [HttpPost("agregar-a-coleccion")]
        [Authorize(Roles = "jugador")]
        [EndpointDescription("Retorna la cant de cartas subidas")]
        public async Task<IActionResult> AgregarAColeccion(List<int> cartas)
        {
            var creador = GetInfoCreador();
            var res = await _userService.AgregarAColeccion(creador.Id, cartas);
            return Ok(res);
        }

        [HttpPost("agregar-mazo")]
        [Authorize(Roles = "jugador")]
        [EndpointDescription("se retorna el id del mazo creado")]
        public async Task<IActionResult> AgregarMazo(List<int> cartas)
        {
            var creador = GetInfoCreador();
            var (idMazo, _) = await _userService.AgregarMazo(creador.Id, cartas);
            return Ok(idMazo);
        }

        // metodo auxiliar para recuperar credenciales del jwt
        private DTOUserClaims GetInfoCreador()
        {
            var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;
            var idClaim = claimsIdentity?.FindFirst(ClaimTypes.Sid)?.Value;
            var emailClaim = claimsIdentity?.FindFirst(ClaimTypes.Email)?.Value;
            var roleClaim = claimsIdentity?.FindFirst(ClaimTypes.Role)?.Value;

            if (idClaim == null || emailClaim == null || roleClaim == null || !Enum.TryParse<UserRole>(roleClaim, out var userRole) || !int.TryParse(idClaim, out int id))
            {
                throw new KeyNotFoundException("No se pudo determinar la informacion del usuario autenticado.");
            }
            return new DTOUserClaims() { 
                Id=id, Email=emailClaim, Role=userRole,
            };
        }
    }
}
