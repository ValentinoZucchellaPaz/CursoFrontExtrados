using Models.DTO.Juegos.Request;
using Models.Entidades;
using Services.Helpers;

namespace Data_Access.DAOTorneo
{
    public class DAOTorneo(DbHelper dbHelper) : IDAOTorneo
    {
        private readonly DbHelper _dbHelper = dbHelper;

        public async Task<IEnumerable<Torneo>> GetTorneosAsync()
        {
            string query = "select * from torneos";
            return await _dbHelper.QueryAsync<Torneo>(query);
        }

        public async Task<Torneo?> GetTorneoByIdAsync(int id)
        {
            string query = "select * from torneos where id=@id";
            return await _dbHelper.QuerySingleOrDefaultAsync<Torneo>(query, new { id });
        }

        public async Task<IEnumerable<SeriesTorneo>> GetSeriesTorneoAsync(int id)
        {
            string query = "select * from series_torneos where id_torneo = @id";
            return await _dbHelper.QueryAsync<SeriesTorneo>(query, new { id });
        }

        public async Task<IEnumerable<int>> GetJuecesTorneoAsync(int id)
        {
            string query = "select id_juez from jueces_oficializadores where id_torneo=@id";
            return await _dbHelper.QueryAsync<int>(query, new { id });
        }

        public async Task<IEnumerable<InscripcionJugador>> GetInscripcionesAsync(int idTorneo)
        {
            string query = "select * from inscripcion_jugadores where id_torneo=@idTorneo";
            return await _dbHelper.QueryAsync<InscripcionJugador>(query, new { idTorneo });
        }

        public async Task<IEnumerable<Juego>> GetJuegosDeTorneoAsync(int idTorneo)
        {
            string query = "select * from juegos where id_torneo=@idTorneo";
            return await _dbHelper.QueryAsync<Juego>(query, new { idTorneo });
        }

        public async Task<Juego?> GetJuegoDeTorneoPorIdAsync(int idTorneo, int numeroJuego)
        {
            string query = @"SELECT * FROM juegos
                            WHERE id_torneo = @idTorneo AND numero_juego = @numeroJuego";
            return await _dbHelper.QuerySingleOrDefaultAsync<Juego>(query, new { idTorneo, numeroJuego });
        }

        // devuelve los ids de las cartas del mazo (del jugador) que se pueden jugar en ese torneo
        public async Task<IEnumerable<int>> ValidarMazo(int idTorneo, int idMazo, int idJugador)
        {
            string query = @"SELECT DISTINCT cpm.id_carta
                            FROM mazos m
	                        JOIN cartas_por_mazo cpm ON m.id = cpm.id_mazo
	                        JOIN cartas_por_serie cps ON cpm.id_carta = cps.id_carta
	                        JOIN series_torneos spt ON cps.id_serie = spt.id_serie
                            WHERE m.id = @idMazo
                                AND m.id_usuario = @idJugador
                                AND spt.id_torneo = @idTorneo;
                            ";
            return await _dbHelper.QueryAsync<int>(query, new { idMazo, idJugador, idTorneo });
        }

        public async Task<bool> ValidarJuezEnTorneo (int idTorneo, int idJuez)
        {
            string query = @"SELECT COUNT(1) FROM jueces_oficializadores
                            WHERE id_torneo = @idTorneo AND id_juez = @idJuez";
            var count = await _dbHelper.ExecuteScalarAsync<int>(query, new { idTorneo, idJuez });
            return count > 0;
        }

        // crear torneo, series, jueces y juegos usando una transaccion (si falla uno hago rollback)
        public async Task<int> CrearTorneoAsync(DateTime fechaInicio, int cantDias, int horasPorDia, string pais, int cantRondas, int idOrganizador, IEnumerable<int> seriesIds, IEnumerable<int> juecesIds)
        {
            using var conn = await _dbHelper.GetConnectionAsync();
            using var transaction = await _dbHelper.BeginTransactionAsync(conn);
            try
            {
                // 1️ Crear torneo
                string torneoQuery = @"insert into torneos (fecha_inicio, cant_dias, horas_por_dia, pais, fase, cant_rondas, id_organizador) 
                            values (@FechaInicio, @cantDias, @horasPorDia, @Pais, 'inscripcion', @CantRondas, @IdOrganizador);
                            select last_insert_id();";
                int torneoId = await _dbHelper.ExecuteScalarAsync<int>(torneoQuery, new { fechaInicio, cantDias, horasPorDia, pais, cantRondas, idOrganizador }, transaction);

                // 2️ Insertar series permitidas
                string seriesQuery = "INSERT INTO series_torneos (id_torneo, id_serie) VALUES (@torneoId, @serieId)";
                await _dbHelper.ExecuteAsync(seriesQuery, seriesIds.Select(s => new { serieId = s, torneoId }), transaction);
                
                // 3️ Insertar jueces
                string juecesQuery = "INSERT INTO jueces_oficializadores (id_juez, id_torneo) VALUES (@juezId, @torneoId)";
                await _dbHelper.ExecuteAsync(juecesQuery, juecesIds.Select(j=>new { juezId=j, torneoId }), transaction);

                // ✅ Confirmo transacción
                transaction.Commit();
                return torneoId;
            }
            catch (Exception ex)
            {
                // ❌ Revierto cambios si algo falla
                transaction.Rollback();
                throw;
            }
        }

        public async Task<bool> InscribirJugadorAsync(int idJugador, int idTorneo, int idMazo)
        {
            string query = @"insert into inscripcion_jugadores (id_jugador, id_torneo, id_mazo) 
                            values (@idjugador, @idTorneo, @idMazo)";
            var res = await _dbHelper.ExecuteAsync(query, new { idJugador, idTorneo, idMazo });
            return res > 0;
        }

        public async Task<bool> RechazarInscripcionAsync(int idTorneo, int idJugador)
        {
            string query = "update inscripcion_jugadores set aceptado = false where id_torneo=@idTorneo and id_jugador=@idJugador";
            var res = await _dbHelper.ExecuteAsync(query, new { idTorneo, idJugador });
            return res > 0;
        }

        public async Task<bool> CambiarFaseAsync(int idTorneo, FasesTorneo nuevaFase)
        {
            string query = "update torneos set fase=@nuevaFase where id=@idTorneo";
            var res = await _dbHelper.ExecuteAsync(query, new { nuevaFase = nuevaFase.ToString(), idTorneo });
            return res > 0;
        }

        // acepta inscripciones, carga juegos y cambia etapa del torneo (se comienza a jugar)
        public async Task<bool> ComenzarTorneo(int idTorneo, List<DTOCrearJuego> juegos)
        {
            using var conn = await _dbHelper.GetConnectionAsync();
            using var transaction = await _dbHelper.BeginTransactionAsync(conn);
            try
            {
                string aceptarInscripciones = "update inscripcion_jugadores set aceptado=true where id_torneo=@idTorneo and aceptado is null";
                string insertJuegos = @"insert into juegos (fecha_inicio, id_torneo, numero_juego, id_jugador_a, id_jugador_b)
                                        values (@fechaInicio, @idTorneo, @numeroJuego, @jugadorA, @jugadorB)";
                string cambiarFase = "update torneos set fase='torneo' where id=@idTorneo";

                await _dbHelper.ExecuteAsync(aceptarInscripciones, new { idTorneo }, transaction);
                await _dbHelper.ExecuteAsync(insertJuegos, 
                    juegos.Select(j=> new { 
                        fechaInicio=j.FechaInicio, 
                        idTorneo,
                        numeroJuego=j.NumeroJuego, 
                        jugadorA=j.JugadorA,
                        jugadorB=j.JugadorB
                    }), transaction);
                await _dbHelper.ExecuteAsync(cambiarFase, new { idTorneo }, transaction);

                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw;
            }
        }

        // se sube juegos y descalificados si hay alguno
        public async Task<bool> CargarResultadoJuegoAsync (DTOResultadoJuego juego, int idJuez, int idJuego)
        {
            using var conn = await _dbHelper.GetConnectionAsync();
            using var transaction = await _dbHelper.BeginTransactionAsync(conn);
            try
            {
                string cargarResQuery = @"UPDATE juegos SET id_ganador = @idGanador, id_juez = @idJuez 
                                        WHERE id = @idJuego";
                string cargarDescalificacion = @"INSERT INTO descalificaciones (id_usuario, id_juego, razon) 
                                                VALUES (@idJugador, @idJuego, @razon)";

                if(juego.IdDescalificado != null)
                {
                    await _dbHelper.ExecuteAsync(cargarDescalificacion, new
                    {
                        idJugador = juego.IdDescalificado,
                        idJuego,
                        razon = juego.RazonDescalificado ?? "Incumplimiento de reglas de torneo"
                    },
                        transaction);
                }

                await _dbHelper.ExecuteAsync(cargarResQuery, new { idGanador=juego.IdGanador, idJuez, idJuego }, transaction);

                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw;
            }
        }
        // hace matchups de ronda
        public async Task<bool> CargarJuegosNuevaRonda (int idTorneo, List<DTOActualizarJuego> juegos)
        {
            var conn = await _dbHelper.GetConnectionAsync();
            var transaction = await _dbHelper.BeginTransactionAsync(conn);
            try
            {
                string query = @"update juegos set id_jugador_a = @JugadorA, id_jugador_b = @JugadorB
                                where id_torneo = @idTorneo and numero_juego = @NumeroJuego";
                await _dbHelper.ExecuteAsync(query, 
                    juegos.Select(x => new
                    {
                        idTorneo,
                        x.JugadorA,
                        x.JugadorB,
                        x.NumeroJuego
                    }), transaction);
                transaction.Commit();
                return true;
            }
            catch(Exception ex)
            {
                transaction.Rollback();
                Console.WriteLine("Error subiendo final");
                throw;
            }
        }

        public async Task<bool> EditarTorneo(int idTorneo, List<int>? nuevosJueces, List<int>? nuevasSeries, int? nuevaCantRondas)
        {
            var conn = await _dbHelper.GetConnectionAsync();
            var transaction = await _dbHelper.BeginTransactionAsync(conn);

            try
            {
                string borrarAnterioresJueces = "delete from jueces_oficializadores where id_torneo = @idTorneo;";
                string subirNuevosJueces = "insert into jueces_oficializadores (id_juez, id_torneo) values (@idJuez, @idTorneo);";
                string borrarAnterioresSeries = "delete from series_torneos where id_torneo = @idTorneo;";
                string subirNuevasSeries = "insert into series_torneos (id_serie, id_torneo) values (@idSerie, @idTorneo)";
                string updateCantRondas = "update torneos set cant_rondas=@nuevaCantRondas where id=@idTorneo";

                if (nuevosJueces != null)
                {
                    await _dbHelper.ExecuteAsync(borrarAnterioresJueces, new { idTorneo }, transaction);
                    await _dbHelper.ExecuteAsync(subirNuevosJueces, nuevosJueces.Select(x => new { idJuez = x, idTorneo }), transaction);
                }


                if (nuevasSeries != null)
                {
                    await _dbHelper.ExecuteAsync(borrarAnterioresSeries, new { idTorneo }, transaction);
                    await _dbHelper.ExecuteAsync(subirNuevasSeries, nuevasSeries.Select(x => new { idSerie = x, idTorneo }), transaction);
                }

                if (nuevaCantRondas != null)
                {
                    await _dbHelper.ExecuteAsync(updateCantRondas, new { idTorneo, nuevaCantRondas });
                }

                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<bool> EditarGanadorJuego(int idTorneo, int numeroJuego, int ganador)
        {
            string query = "update juegos set id_ganador = @ganador where id_torneo = @idTorneo and numero_juego = @numeroJuego";
            var filasAfectadas = await _dbHelper.ExecuteAsync(query, new { ganador, idTorneo, numeroJuego });
            return filasAfectadas > 0;
        }

        public async Task<bool> EditarJugadoresJuego(int idTorneo, int numeroJuego, int jugadorA, int jugadorB)
        {
            string query = "update juegos set id_jugador_a=@jugadorA, id_jugador_b=@jugadorB where id_torneo = @idTorneo and numero_juego = @numeroJuego";
            var filasAfectadas = await _dbHelper.ExecuteAsync(query, new { jugadorA, jugadorB, idTorneo, numeroJuego });
            return filasAfectadas > 0;
        }
        public async Task<bool> CancelarTorneoAsync(int idTorneo)
        {
            string query = "update torneos set fase='cancelado' where id = @idTorneo";
            var res = await _dbHelper.ExecuteAsync(query, new { idTorneo });
            return res > 0;
        }
    }
}
