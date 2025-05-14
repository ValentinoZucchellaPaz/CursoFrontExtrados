using Models.DTO.Juegos.Request;
using Models.DTO.Juegos.Response;
using Models.DTO.Torneos.Request;
using Models.DTO.Torneos.Response;
using Models.DTO.Usuarios;
using Models.DTO.Usuarios.Request;

namespace Services.TorneoService
{
    public interface ITorneoService
    {
        /// <summary>
        /// Crea torneo junto con los jueces oficializadores y la cant de rondas segun el tiempo disponible
        /// </summary>
        /// <param name="request">Objeto con informacion de creacion del torneo</param>
        /// <param name="creador">Objeto con informacion del creador del torneo</param>
        /// <exception cref="ArgumentException">Jueces no validos</exception>
        /// <returns>Un objeto con id del torneo, cant rondas y cant jugadores</returns>
        public Task<DTOResultadosCreacionTorneo> CrearTorneo(DTOCrearTorneo request, DTOUserClaims creador);

        /// <summary>
        /// Inscribe un jugador en el torneo (lo pone en lista de espera a que el organizador los acepte)
        /// </summary>
        /// <param name="request">Objeto con informacion de la inscripcion (idTorneo, idMazo)</param>
        /// <param name="jugador">Objeto con informacion del jugador</param>
        /// <exception cref="KeyNotFoundException">Torneo no existe</exception>
        /// <exception cref="InvalidOperationException">Torneo no se encuentra en fase de inscripcion o no quedan cupos</exception>
        /// <exception cref="ArgumentException">Las cartas del mazo no son validas (o no pertenece al jugador)</exception>
        public Task<bool> InscribirJugador(DTOInscribirJugador request, DTOUserClaims jugador);

        /// <summary>
        /// Se acepta jugadores solo si llenan el torneo, luego se arma la primer ronda y se pasa a la siguiente etapa del torneo (se comienza a jugar)
        /// </summary>
        /// <param name="idTorneo">Id del torneo a jugar</param>
        /// <param name="creador">Objeto con informacion del organizador que manda la orden</param>
        /// <exception cref="KeyNotFoundException">Torneo no existe</exception>
        /// <exception cref="UnauthorizedAccessException">Organizador no es valido</exception>
        /// <exception cref="InvalidOperationException">Torneo no está en fase de inscripcion o no se llenó el cupo o hubieron problemas en db</exception>
        /// <returns>Una lista con todos los juegos del torneo</returns>
        public Task<(IEnumerable<DTOCrearJuego>, int? nuevaCantRondas)> ComenzarTorneo(int idTorneo, DTOUserClaims creador, bool force);

        /// <summary>
        /// Se pone el resultado del juego (ganador y descalificado) solo si juego ya se jugó, ademas verifica que si se jugó la final se termina el torneo, si se jugaron todos los partidos de la ronda se pasa a la siguiente (se arman partidos con ganadores de ronda)
        /// </summary>
        /// <param name="resultadoJuego">Objeto con informacion del juego</param>
        /// <param name="juez">Objeto con informacion del juez que manda la orden</param>
        /// <exception cref="KeyNotFoundException">Si no existe el torneo o el juego</exception>
        /// <exception cref="UnauthorizedAccessException">Juez no es valido</exception>
        /// <exception cref="InvalidOperationException">Juego sin jugar o ya oficializado</exception>
        /// <exception cref="ArgumentException">Jugador oficializado invalido (no pertenece al juego o descalificado ganó)</exception>
        public Task<DTOJuegoOficializado> OficializarJuego(DTOResultadoJuego resultadoJuego, DTOUserClaims juez);

        /// <summary>
        /// Crea los juegos del torneo junto con las parejas de la primera ronda
        /// </summary>
        /// <param name="idTorneo">Id del torneo</param>
        /// <param name="creador">Objeto con informacion del organizador que manda la orden</param>
        /// <exception cref="KeyNotFoundException">Torneo no existe</exception>
        /// <exception cref="InvalidOperationException">Torneo ya cancelado</exception>
        public Task<bool> CancelarTorneo(int idTorneo, DTOUserClaims creador);

        /// <summary>
        /// Se pasa una nueva lista de ids de jueces que oficializan el torneo y opcionalmente una nueva lista de series permitidas
        /// </summary>
        /// <param name="idTorneo"></param>
        /// <param name="request">Objeto con lista de jueces nuevos y (opcional) lista de series nuevas</param>
        /// <exception cref="KeyNotFoundException">No se encontró el torneo en db</exception>
        /// <exception cref="InvalidOperationException">Torneo ya terminado</exception>
        /// <exception cref="ArgumentException">Los ids de jueces o series son invalidos</exception>
        /// <returns></returns>
        public Task<bool> EditarTorneo(int idTorneo, DTOEditarTorneo request);

        /// <summary>
        /// Se puede editar el ganador del juego como tambien los jugadores del juego, tanto de un juego no oficializado como de uno si oficializado
        /// </summary>
        /// <param name="idTorneo"></param>
        /// <param name="numeroJuego"></param>
        /// <param name="request">Objeto con id del ganador y/o nuevos jugadores</param>
        /// <exception cref="KeyNotFoundException">No se encontró el torneo en db</exception>
        /// <exception cref="InvalidOperationException">Torneo ya terminado</exception>
        /// <exception cref="ArgumentException">Los ids de jueces o series son invalidos</exception>
        /// <returns></returns>
        public Task<bool> EditarJuego(int idTorneo, int numeroJuego, DTOEditarJuego request);

        public Task<bool> RechazarInscripcionJugador(int idTorneo, int idJugador);
    }
}
