using Data_Access.DAOCartas;
using Data_Access.DAOTorneo;
using Data_Access.DAOUsuario;
using Microsoft.IdentityModel.Tokens;
using Models.DTO.Juegos.Request;
using Models.DTO.Juegos.Response;
using Models.DTO.Torneos.Request;
using Models.DTO.Torneos.Response;
using Models.DTO.Usuarios;
using Models.DTO.Usuarios.Request;
using Models.Entidades;
using System.Data;

namespace Services.TorneoService
{
    public class TorneoService(IDAOTorneo daoTorneo, IDAOUsuario daoUsuarios, IDAOCartas daoCartas) : ITorneoService
    {
        private readonly IDAOTorneo _daoTorneo = daoTorneo;
        private readonly IDAOUsuario _daoUsuarios = daoUsuarios;
        private readonly IDAOCartas _daoCartas = daoCartas;


        public async Task<DTOResultadosCreacionTorneo> CrearTorneo(DTOCrearTorneo request, DTOUserClaims creador)
        {
            // segun tiempo disponible se determina cant de rondas (ademas cant de partidos y jugadores max)
            // por ahora el minimo esta en 1 dia (8hs => octavos de final) ARREGLAR ESTO
            var cantRondas = GetCantidadRondas(request.CantDias, request.HorasPorDia);

            var res = new DTOResultadosCreacionTorneo
            {
                CantidadJugadores = GetCantidadJugadores(cantRondas), // 2^cantRondas
                CantidadJuegos = GetCantidadJuegos(cantRondas) // (2^cantRondas) - 1
            };

            // validar jueces (deben ser usuarios con role='juez')
            // series y pais si no son correctos rompen la consulta en db --> ver de catchear antes de que salte mysql exception
            var juecesValidadosDb = await _daoUsuarios.ValidarIdsJueces(request.JuecesOficializadores);
            if (request.JuecesOficializadores.Count != juecesValidadosDb.Count())
                throw new ArgumentException("La lista de ids de jueces oficializadores no es valida (pueden no ser jueces o no existir el id de usuario)");

            // subir a db usando transaccion (no deja datos inconsistentes en db)
            res.IdTorneo = await _daoTorneo.CrearTorneoAsync(
                request.FechaInicio.Date.AddHours(16),
                request.CantDias,
                request.HorasPorDia,
                request.Pais,
                cantRondas,
                creador.Id,
                request.SeriesPermitidas,
                request.JuecesOficializadores);

            return res;
        }

        public async Task<bool> InscribirJugador(DTOInscribirJugador request, DTOUserClaims jugador)
        {
            // validar torneo existente, en fase de inscripcion y no esta lleno
            var torneo = await _daoTorneo.GetTorneoByIdAsync(request.IdTorneo) ?? throw new KeyNotFoundException($"No hay ningun torneo con id {request.IdTorneo}");
            var cantJugadoresMax = GetCantidadJugadores(torneo.Cant_rondas);
            var inscripciones = await _daoTorneo.GetInscripcionesAsync(torneo.Id);

            if (torneo.Fase != FasesTorneo.inscripcion.ToString()) throw new InvalidOperationException("El torneo no se encuentra en fase de inscripcion");
            if (cantJugadoresMax <= inscripciones.Count()) throw new InvalidOperationException("No quedan mas cupos para inscribirte en el torneo");

            // validar que mazo sea de jugador y contiene cartas de serie permitida
            var cartasPermitidasDelMazo = await _daoTorneo.ValidarMazo(request.IdTorneo, request.IdMazo, jugador.Id);
            if (cartasPermitidasDelMazo.Count() != 15) throw new ArgumentException("El mazo con el que te quieres inscribir no cumple con los requisitos del torneo");

            // inscribir en db
            return await _daoTorneo.InscribirJugadorAsync(jugador.Id, request.IdTorneo, request.IdMazo);
        }

        public async Task<(IEnumerable<DTOCrearJuego>, int? nuevaCantRondas)> ComenzarTorneo(int idTorneo, DTOUserClaims creador, bool force)
        {
            var torneo = await _daoTorneo.GetTorneoByIdAsync(idTorneo) ?? throw new KeyNotFoundException($"No existe el torneo con id {idTorneo}");
            var inscripciones = await _daoTorneo.GetInscripcionesAsync(torneo.Id);
            var inscripcionesDisponibles = inscripciones.Where(x => x.Aceptado != false); // inscripciones aceptadas y pendientes
            if (inscripcionesDisponibles.IsNullOrEmpty()) throw new InvalidOperationException("No existe ningún inscripto al torneo");
            int cantJugadoresIdeal = GetCantidadJugadores(torneo.Cant_rondas);

            int? nuevaCantRondas = null;

            //validar torneo en modo inscripcion, creador legit y que inscripciones esten llenas
            if (torneo.Id_organizador != creador.Id) 
                throw new UnauthorizedAccessException($"Solo el organizador que creo este torneo (id: {torneo.Id_organizador}) puede aceptar la inscripcion, no el organizador con id {creador.Id}");
            if (torneo.Fase != FasesTorneo.inscripcion.ToString()) 
                throw new InvalidOperationException($"El torneo con id {idTorneo} no esta en fase de inscripcion, sino en fase: {torneo.Fase}");
            if (cantJugadoresIdeal > (inscripcionesDisponibles.Count()))
            {
                if (!force)
                {
                    throw new InvalidOperationException("Aun quedan lugares disponibles para la inscripcion");
                }

                // cambio reglas torneo: si faltan jugadores armo torneo con cantidad de jugadores que tengo (numero de rondas mas cercanos)
                // si siguen faltando dps de bajar el numero de rondas, hago juegos sombrero
                torneo.Cant_rondas = (int)Math.Ceiling(Math.Log2(inscripcionesDisponibles.Count())); // redondea para arriba el nuevo numero de rondas log2(jugadores)
                nuevaCantRondas = torneo.Cant_rondas;
            }

            //hacer transaccion para aceptar inscripciones, crear y subir juegos (y matchups primera ronda) y cambiar fase
            var juegos = CrearJuegosTorneo(torneo.Cant_rondas, inscripcionesDisponibles.ToList(), torneo.Fecha_inicio, torneo.Cant_dias, torneo.Horas_por_dia);
            var exito = await _daoTorneo.ComenzarTorneo(torneo.Id, juegos);
            if (!exito) throw new InvalidOperationException("Hubo un problema creando los juegos");
            await _daoTorneo.EditarTorneo(torneo.Id, null, null, torneo.Cant_rondas); // actualizo nueva cant de rondas en db

            return (juegos, nuevaCantRondas);
        }

        public async Task<DTOJuegoOficializado> OficializarJuego (DTOResultadoJuego resultadoJuego, DTOUserClaims juez)
        {
            // valido que torneo existe (simplemente para mejor feedback, no es necesario en realidad) y se está jugando
            Torneo torneo = await _daoTorneo.GetTorneoByIdAsync(resultadoJuego.IdTorneo)
                ?? throw new KeyNotFoundException($"No existe el torneo con id {resultadoJuego.IdTorneo}");
            if (torneo.Fase != FasesTorneo.torneo.ToString())
                throw new InvalidOperationException($"El torneo {resultadoJuego.IdTorneo} no se encuentra en la fase de juego");

            // valido que juez es del torneo
            bool juezPermitido = await _daoTorneo.ValidarJuezEnTorneo(resultadoJuego.IdTorneo ,juez.Id);
            if (!juezPermitido) 
                throw new UnauthorizedAccessException($"El juez con id {juez.Id} no tiene permitido oficilizar juegos del torneo {resultadoJuego.IdTorneo}");
            // valido que existe juego, que ya se jugó, que no se oficializó aun y que el ganador es uno de los jugadores --> poner en metodo aparte para mejor lectura
            Juego juego = await _daoTorneo.GetJuegoDeTorneoPorIdAsync(resultadoJuego.IdTorneo, resultadoJuego.NumeroJuego) 
                ?? throw new KeyNotFoundException($"No existe el juego numero {resultadoJuego.NumeroJuego} en el torneo {resultadoJuego.IdTorneo}");
            if (juego.Fecha_inicio > DateTime.Now || juego.Id_jugador_a == null) 
                throw new InvalidOperationException("Aun no se ha jugado el juego");
            if (juego.Id_ganador != null) 
                throw new InvalidOperationException("Este juego ya tiene un ganador");
            if (resultadoJuego.IdGanador != juego.Id_jugador_a && resultadoJuego.IdGanador != juego.Id_jugador_b) 
                throw new ArgumentException($"El jugador marcado como ganador no pertenece a este juego (jugadores {juego.Id_jugador_a}, {juego.Id_jugador_b})");
            if (resultadoJuego.IdDescalificado == resultadoJuego.IdGanador)
                throw new ArgumentException($"El jugador {resultadoJuego.IdDescalificado} no puede ser el ganador ya que este fue descalificado.");


            // cargar resultado a db: hace transaccion y si hay descalificado lo sube tmb
            bool juegoCargado = await _daoTorneo.CargarResultadoJuegoAsync(resultadoJuego, juez.Id, juego.Id);

            DTOJuegoOficializado juegoOficializado = new DTOJuegoOficializado() { JuegoOficializado = juegoCargado };

            if(juegoCargado)
            {
                Console.WriteLine($"Resultado juego {resultadoJuego.NumeroJuego} se cargó correctamente");
                // validar si se jugó la final (termino torneo) o si paso a sig ronda (armo juegos nueva ronda)
                var (esFinalRonda, esFinalTorneo) = ValidarFinalPartido(resultadoJuego.NumeroJuego, torneo.Cant_rondas);
                if (esFinalTorneo)
                {
                    // terminar torneo, se acaba de oficializar la final
                    var terminado = await _daoTorneo.CambiarFaseAsync(torneo.Id, FasesTorneo.finalizado);
                    if (terminado)
                    {
                        Console.WriteLine($"torneo terminado, id ganador {resultadoJuego.IdGanador}");
                        juegoOficializado.IdGanadorTorneo = resultadoJuego.IdGanador;
                    }
                }
                else if (esFinalRonda)
                {
                    // pasa a siguiente ronda -- llamo juegos, obtengo ganadores esta ronda, armo juegos prox ronda, subo a db
                    IEnumerable<Juego> juegos = await _daoTorneo.GetJuegosDeTorneoAsync(resultadoJuego.IdTorneo);

                    // recuperar los juegos de la ronda actual
                    int rondaActual = GetNumeroRonda(resultadoJuego.NumeroJuego, torneo.Cant_rondas);
                    int primerJuegoRondaActual = CalcularNumeroJuegoInicio(rondaActual, torneo.Cant_rondas);
                    int cantJuegosDeRonda = (int)Math.Pow(2, torneo.Cant_rondas - rondaActual);
                    List<int> numerosJuegosRonda = Enumerable.Range(primerJuegoRondaActual, cantJuegosDeRonda).ToList();
                    IEnumerable<Juego> juegosRonda = juegos.Where(x => numerosJuegosRonda.Contains(x.Numero_juego));


                    int primerJuegoNuevaRonda = resultadoJuego.NumeroJuego + 1;

                    List<int> ganadores = juegosRonda.Select(x => x.Id_ganador.Value).ToList();

                    Console.WriteLine($"cant de juegos esta ronda: {cantJuegosDeRonda}");
                    Console.WriteLine($"primer juego prox ronda ({rondaActual + 1}/{torneo.Cant_rondas}) : {primerJuegoNuevaRonda}");
                    Console.WriteLine($"cant ganadores: {ganadores.Count}");

                    List<DTOActualizarJuego> nuevosJuegos = [];
                    for (int i = 0; i < ganadores.Count; i += 2)
                    {
                        int numeroJuego = primerJuegoNuevaRonda + (i / 2);
                        DTOActualizarJuego juegoNuevo = new()
                        {
                            NumeroJuego = numeroJuego,
                            JugadorA = ganadores[i],
                            JugadorB = ganadores[i + 1],
                        };
                        nuevosJuegos.Add(juegoNuevo);
                    }

                    Console.WriteLine($"cant nuevos juegos: {nuevosJuegos.Count}");
                    Console.WriteLine("------------------------------------------------------------------------------\n");

                    bool rondasCargadas =  await _daoTorneo.CargarJuegosNuevaRonda(resultadoJuego.IdTorneo, nuevosJuegos);
                    if (rondasCargadas)
                    {
                        juegoOficializado.JuegosProxRonda = nuevosJuegos;
                    }
                }

            }

            return juegoOficializado; // cambiar y devolver un objeto, se hacen mas de una validacion acá
        }

        public async Task<bool> CancelarTorneo(int idTorneo, DTOUserClaims creador)
        {
            var torneo = await _daoTorneo.GetTorneoByIdAsync(idTorneo) 
                ?? throw new KeyNotFoundException($"No existe el torneo con id {idTorneo}");
            if (torneo.Fase == FasesTorneo.cancelado.ToString()) 
                throw new InvalidOperationException("El torneo ya se encuentra cancelado");
            return await _daoTorneo.CancelarTorneoAsync(idTorneo);
        }

        public async Task<bool> RechazarInscripcionJugador (int idTorneo, int idJugador)
        {
            Torneo torneo = await _daoTorneo.GetTorneoByIdAsync(idTorneo)
                ?? throw new KeyNotFoundException($"No existe el torneo {idTorneo}");
            if (torneo.Fase != FasesTorneo.inscripcion.ToString()) 
                throw new InvalidOperationException($"El torneo {idTorneo} no se encuentra en fase de inscripcion");
            var eliminado = await _daoTorneo.RechazarInscripcionAsync(idTorneo, idJugador);
            if (!eliminado) throw new ArgumentException("No se pudo rechazar la inscripcion del jugador, verifica que pertenezca al torneo");
            return eliminado;
        }

        public async Task<bool> EditarTorneo(int idTorneo, DTOEditarTorneo request)
        {
            if(request.NuevasSeriesCartas.IsNullOrEmpty() && request.NuevosJueces.IsNullOrEmpty())
                throw new InvalidOperationException("No se ha pasado ningun argumento que editar");
            Torneo torneo = await _daoTorneo.GetTorneoByIdAsync(idTorneo) ?? throw new KeyNotFoundException($"El torneo {idTorneo} no existe");
            if (torneo.Fase == FasesTorneo.finalizado.ToString()) throw new InvalidOperationException("El torneo ya esta finalizado, no se puede editar");

            // validar que los ids son de jueces activos y retorno cuales no
            var juecesValidados = await _daoUsuarios.ValidarIdsJueces(request.NuevosJueces);
            if (juecesValidados.Count() < request.NuevosJueces.Count)
            {
                var idsValidas = juecesValidados.Select(x=>x.Id).ToList();
                var idsInvalidas = request.NuevosJueces.Where(x => !idsValidas.Contains(x));
                throw new ArgumentException($"Hay ids que no pertenecen a jueces activos: {String.Join(", ", idsInvalidas)}");
            }

            // si se cambian series, validar que son validas y retorno cuales no
            if(request.NuevasSeriesCartas != null)
            {
                var series = await _daoCartas.GetSeriesAsync();
                var seriesValidas = series.Select(x=>x.Id).ToList();
                var seriesInvalidas = request.NuevasSeriesCartas.Where(x => !seriesValidas.Contains(x));
                if (!seriesInvalidas.IsNullOrEmpty()) throw new ArgumentException($"Hay ids que no pertenecen a series validas: {String.Join(", ", seriesInvalidas)}");
            }

            return await _daoTorneo.EditarTorneo(idTorneo, request.NuevosJueces, request.NuevasSeriesCartas, null);

        }

        public async Task<bool> EditarJuego(int idTorneo, int numeroJuego, DTOEditarJuego request)
        {
            if(request.IdGanador == null && request.JugadorB == null && request.JugadorA == null)
                throw new ArgumentNullException("Todos los campos de la request estan vacios");

            _ = await _daoTorneo.GetTorneoByIdAsync(idTorneo) ?? throw new KeyNotFoundException($"torneo con id {idTorneo} no encontrado");
            Juego juego = await _daoTorneo.GetJuegoDeTorneoPorIdAsync(idTorneo, numeroJuego) ?? throw new ArgumentOutOfRangeException($"No se encontro el juego {numeroJuego} en el torneo {idTorneo}");

            // si juego es de una fase por venir, no se puede editar
            // si ya se jugo y tiene ganador, no se puede cambiar jugadores
            // si aun no se jugo, no se puede cambiar ganador
            if (juego.Id_jugador_b == null || juego.Id_jugador_a == null)
                throw new ArgumentException("Este juego aun no tiene jugadores que editar");

            if (juego.Id_ganador != null && (request.JugadorB != null || request.JugadorA != null))
                throw new InvalidOperationException("El juego ya tiene ganador, no se pueden cambiar los jugadores de este juego");

            if (juego.Id_jugador_b != null && juego.Id_jugador_a != null && request.IdGanador != null)
                throw new InvalidOperationException("El juego aun no se juega, no se puede asignar un ganador");

            // o se actualiza ganador o jugadores DUAL BEHAVIOUR
            if(request.IdGanador != null)
            {
                if (request.IdGanador != juego.Id_jugador_a && request.IdGanador != juego.Id_jugador_b)
                    throw new InvalidOperationException($"El ganador del juego debe ser alguno de los jugadores: A ({juego.Id_jugador_a}), B ({juego.Id_jugador_b})");
                return await _daoTorneo.EditarGanadorJuego(idTorneo, numeroJuego, request.IdGanador.Value);
            }
            // si actualizo jugadores, el jugador que sea null se pone con el valor que tiene en el juego
            request.JugadorA ??= juego.Id_jugador_a;
            request.JugadorB ??= juego.Id_jugador_b;
            return await _daoTorneo.EditarJugadoresJuego(idTorneo, numeroJuego, request.JugadorA.Value, request.JugadorB.Value);
        }


        // --------------------------------------METODOS AUXILIARES-------------------------------------------------
        /// <summary>
        /// Crea los juegos del torneo junto con las parejas de la primera ronda
        /// </summary>
        /// <param name="cantRondas">Cantidad de rondas del torneo</param>
        /// <param name="jugadores">Lista de jugadores que jugaran el torneo</param>
        /// <param name="fechaInicio">Hora fecha que comienza el torneo</param>
        /// <param name="fechaFin">Hora fecha que termina el torneo</param>
        private static List<DTOCrearJuego> CrearJuegosTorneo(int cantRondas, List<InscripcionJugador> jugadores, DateTime fechaInicio, int cantDias, int horasPorDia)
        {
            int totalJuegos = GetCantidadJuegos(cantRondas);
            int cantJuegosPrimeraRonda = 1 << (cantRondas - 1); // 2^(cantRondas - 1)
            List<DateTime> horarios = CalcularHorariosPartidas(totalJuegos, fechaInicio, cantDias, horasPorDia);
            List<DTOCrearJuego> juegos = [];
            List<InscripcionJugador> jugadoresAleatorios = [.. jugadores.OrderBy(x => Guid.NewGuid())];
            int jugadoresDisponibles = jugadoresAleatorios.Count;


            // si faltan jugadores para primera ronda asigno byes (juegos sombrero)
            int byeCount = (cantJuegosPrimeraRonda * 2) - jugadoresDisponibles;
            int juegosCompletos = cantJuegosPrimeraRonda - byeCount;

            int indexJugador = 0;
            for (int i = 0; i < cantJuegosPrimeraRonda; i++)
            {
                int? idJugadorA = null, idJugadorB = null;
                bool esBye = false;

                if (i < juegosCompletos)
                {
                    idJugadorA = jugadoresAleatorios[indexJugador++].Id_jugador;
                    idJugadorB = jugadoresAleatorios[indexJugador++].Id_jugador;
                } else
                {
                    idJugadorA = jugadoresAleatorios[indexJugador++].Id_jugador;
                    esBye = true;
                }


                juegos.Add(new DTOCrearJuego()
                {
                    FechaInicio = horarios.ElementAt(i),
                    JugadorA = idJugadorA,
                    JugadorB = idJugadorB,
                    NumeroJuego = i + 1,
                    EsBye = esBye
                });
            }

            // creo juegos restantes (dejo pre-creados)
            for (int i = cantJuegosPrimeraRonda; i < totalJuegos; i++)
            {
                juegos.Add(new DTOCrearJuego()
                {
                    FechaInicio = horarios.ElementAt(i),
                    NumeroJuego = i + 1,
                });
            }
            return juegos;
        }

        /// <summary>
        /// Calcula la cantidad de juegos del torneo segun la cantidad de rondas totales((2^N)-1)
        /// </summary>
        /// <param name="cantRondas">Cantidad de rondas del torneo</param>
        private static int GetCantidadJuegos(int cantRondas)
        {
            return (int)Math.Pow(2, cantRondas) -1;
        }

        /// <summary>
        /// Calcula la cantidad de jugadores que tiene un torneo con N rondas (2^N)
        /// </summary>
        /// <param name="cantRondas">Cantidad de rondas del torneo torneo</param>
        private static int GetCantidadJugadores(int cantRondas)
        {
            return (int)Math.Pow(2, cantRondas);
        }

        /// <summary>
        /// Calcula la cantidad de rondas que puede tener un torneo segun el tiempo disponible (cant de días por horas por día)
        /// </summary>
        /// <param name="cantDias">Cant de días del torneo</param>
        /// <param name="horasPorDia">Horas de juego por día del torneo</param>
        private static int GetCantidadRondas(int cantDias, int horasPorDia)
        {
            const int duracionPartida = 30; // minutos

            // Calc días disponibles
            int tiempoTotalDisponible = cantDias * horasPorDia * 60; // minutos

            // calculo cantidad de partidas que entran
            int partidasDisponibles = tiempoTotalDisponible / duracionPartida;

            // Encontrar la mayor cantidad de rondas (r) tal que 2^r - 1 (partidas totales) <= partidosDisponibles
            int rondas = 0;
            while ((int)Math.Pow(2, rondas) - 1 <= partidasDisponibles)
            {
                rondas++;
            }
            // cuando sale del bucle hay una ronda mas
            return rondas - 1;
        }

        /// <summary>
        /// Calcula la ronda a partir del número de juego, desde 1 hasta el max de juegos 2^(totalRondas-1)
        /// </summary>
        /// <param name="numeroJuego">Número de juego del primer partido de la ronda actual.</param>
        /// <param name="totalRondas">Cantidad total de rondas del torneo.</param>
        /// <returns>La ronda actual (1-based).</returns>
        private static int GetNumeroRonda(int numeroJuego, int totalRondas)
        {
            // Cantidad de juegos en la primera ronda (round 1)
            int juegosRonda = (int)Math.Pow(2, totalRondas - 1);
            int ronda = 1;
            int acumulado = juegosRonda;

            // voy sumando los juegos y rondas (cuento) hasta el juego actual
            while (numeroJuego > acumulado && ronda < totalRondas)
            {
                ronda++;
                juegosRonda /= 2;  // En la siguiente ronda hay la mitad de juegos que en la anterior.
                acumulado += juegosRonda;
            }
            return ronda;
        }

        /// <summary>
        /// Calcula el número de juego del primer partido de una ronda, dada la cantidad total de rondas.
        /// </summary>
        /// <param name="ronda">Número de ronda actual</param>
        /// <param name="totalRondas">Número total de rondas</param>
        /// <returns>El número del primer juego de la siguiente ronda</returns>
        private static int CalcularNumeroJuegoInicio(int ronda, int totalRondas)
        {
            int inicio = 0;
            // va sumando los juegos de cada ronda hasta una una antes de la que quiero calc
            for (int i = 1; i < ronda; i++)
            {
                inicio += (int)Math.Pow(2, totalRondas - i); 
            }
            return inicio + 1;
        }

        /// <summary>
        /// Calcula los horarios de inicio de las partidas en el torneo de manera que se distribuyan uniformemente en el tiempo disponible (desde la fecha-hora de inicio, durante la cant de días y horas por día esteblecidos).
        /// </summary>
        /// <param name="cantidadPartidas">Cantidad total de partidas a jugar.</param>
        /// <param name="fechaInicio">Fecha de inicio del torneo.</param>
        /// <param name="cantDias">Cant de días que dura el torneo.</param>
        /// <param name="horasPorDia">Cant de horas por día que se juega el torneo</param>
        /// <returns>Una lista de DateTime con los horarios de inicio de cada partida.</returns>
        /// <exception cref="ArgumentException">Si no hay tiempo suficiente para acomodar todas las partidas.</exception>
        private static List<DateTime> CalcularHorariosPartidas(int cantidadPartidas, DateTime fechaInicio, int cantDias, int horasPorDia)
        {
            // Horario disponible cada día 16hs a 00hs 8hs= 480min
            int minutosPorDia = horasPorDia * 60;
            const int duracionPartida = 30; // minutos
            //const int horaMaxDia = 00; // esto queda asi siempre, sino tengo que cambiar lógica

            // Calc días disponibles
            int totalMinutosDisponibles = cantDias * minutosPorDia;

            // Validar que hay tiempo suficiente sin solapamiento
            if (totalMinutosDisponibles < cantidadPartidas * duracionPartida)
                throw new ArgumentException("No hay tiempo suficiente para jugar todas las partidas sin solapamientos." +
                    $"\nJuegos: {cantidadPartidas}" +
                    $"\nCant minutos disponibles: {totalMinutosDisponibles}" +
                    $"\nMinutos de juego: {cantidadPartidas * duracionPartida}");

            List<DateTime> horarios = [];
            if (cantidadPartidas == 1) // si es una final se juega a primera hora el dia de inicio
            {
                horarios.Add(fechaInicio);
                return horarios;
            }

            // Calcular el gap (intervalo) entre inicios de partidas.
            // El primer partido empieza en t=0 y el último debe iniciar en t = (tiempoTotalDisponible - duracionPartida).
            double gap = (double)(totalMinutosDisponibles - duracionPartida) / (cantidadPartidas - 1);

            for (int i = 0; i < cantidadPartidas; i++)
            {
                // Tiempo (minutos) desde el inicio del primer día.
                double t = i * gap;

                // Determinar en qué día (0-indexado) y en qué minuto del día cae el partido.
                int diaIndex = (int)(t / minutosPorDia);
                if (diaIndex >=cantDias)
                    throw new ArgumentException("No hay tiempo suficiente para distribuir las partidas en los dias disponibles");
                int minutoEnDia = (int)(t % minutosPorDia);

                // Cada día la partida puede comenzar a partir de las 16:00.
                DateTime inicioDiaDisponible = fechaInicio.AddDays(diaIndex);

                // Calcular la hora de inicio real sumándole los minutos correspondientes.
                DateTime horaInicioPartida = inicioDiaDisponible.AddMinutes(minutoEnDia);

                horarios.Add(horaInicioPartida);
            }

            return horarios;
        }

        /// <summary>
        /// Valida si el partido oficializado (identificado por su número) es el final de su ronda o la final del torneo.
        /// </summary>
        /// <param name="numeroJuego">El número del partido oficializado.</param>
        /// <param name="totalRondas">Cantidad total de rondas del torneo.</param>
        /// <returns>Una tupla booleana: (esFinalDeRonda, esFinalDelTorneo)</returns>
        private static (bool esFinalRonda, bool esFinalTorneo) ValidarFinalPartido(int numeroJuego, int totalRondas)
        {
            int totalJuegos = GetCantidadJuegos(totalRondas);
            bool esFinalTorneo = totalJuegos == numeroJuego;

            int ronda = GetNumeroRonda(numeroJuego, totalRondas);
            int juegoInicioRonda = CalcularNumeroJuegoInicio(ronda, totalRondas);
            int cantidadJuegosRonda = (int) Math.Pow(2, totalRondas - ronda); // 2^(totalRondas - ronda)
            int juegoFinalRonda = juegoInicioRonda + cantidadJuegosRonda - 1;
            bool esFinalRonda = juegoFinalRonda == numeroJuego;

            return (esFinalRonda, esFinalTorneo);
        }
    }
}
