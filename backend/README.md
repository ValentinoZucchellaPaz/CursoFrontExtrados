## Endpoints:  
  
### /Info: obten informacion de cartas torneos y usuarios  
- `GET` **/cartas**  
Una lista de todas las cartas
- `GET` **/cartas/{id-name}**  
Informacion de la carta con ese id o nombre
- `GET` **/series**  
Una lista de las series de cartas
- `GET` **/series/{id-name}**  
Informacion de la serie con ese id o nombre
- `GET` **/serie/{id-name}/cartas**  
Una lista de las cartas que pertenecen a esa serie  
- `GET` **/torneos**  
Una lista de todos los torneos (pasados y activos)  
- `GET` **/torneos/{id}**  
TODA la informacion del torneo (series, cartas, juegos, jugadores inscriptos, jueces)  
- `GET` **/usuarios/jugadores**  
Una lista de los jugadores activos
- `GET (PROTECTED: juez, organizador, admin)` **/usuarios/jueces**  
Una lista de los jueces activos
- `GET (PROTECTED: organizador, admin)` **/usuarios/organizadores**  
Una lista de los organizadores activos
- `GET (PROTECTED: admin)` **/usuarios/admins**  
Una lista de los administradores activos
- `GET (PROTECTED)` **/usuarios/all**  
Segun el rol del JWT pasado en la request, se muestran todos los usuarios que se pueden ver con ese rol.  
- `GET (PROTECTED)` **/usuarios/{id-mail-alias}**  
El usuario con ese id, nombre, o mail. Solo se muestra si el rol del usuario buscado, se puede ver para alguien con el rol del JWT pasado en la request, sino 401.  
  
  
### /Usuario: administra usuarios en db junto con sus mazos y colecciones  
#### Autenticacion y Login
- `POST` **/sign-up-jugador**  
Se pasa todos los datos del jugador, SOLO SE REGISTRAN JUGADORES
- `POST (PROTECTED: juez, organizador, admin)` **/sign-up**  
Se pasa todos los datos del usuario, de los cuales el rol debe ser uno del enum { admin, juez, organizador } NO SE REGISTRAN JUGADORES AQUI, se usa el id del jwt para el id_creador del usuario
- `POST` **/login**  
Se pasa email y contraseña, se devuelve un access token que dura 1 dia con otra información util. Ademas se devuelve una cookie con el token y de duración un dia. 
- `POST` **/refresh-token**
Se envia un cuerpo vacio y el endpoint verifica el refresh token de las cookies, si es valido guarda uno nuevo en cookies y devuelve un nuevo access token
- `POST (PROTECTED)` **/logout**
Se envia un cuerpo vacio y el endpoint borra el refresh token de las cookies y da de baja el mismo para que no pueda volver a usarse
- `POST (PROTECTED: admin)` **/borrar/{id}**  
Borrado logico del usuario en db  
- `PATCH (PROTECTED: admin)` **/editar/{id}**  
Se edita el usuario con esa id en la db, se deben pasar valores distintos a los que hay en db  
#### Coleccion y mazos de usuario
- `GET (PROTECTED: jugador)` **/coleccion**  
Se devuelve una lista de las cartas en la coleccion del usuario.  
- `GET (PROTECTED: jugador)` **/mazos**  
Se devuelve una lista de los id de los mazos y una lista de los nombres de las cartas de ese jugador
- `GET (PROTECTED: jugador)` **/mazos/{id}**  
Se devuelve una lista de las cartas del mazo del usuario.  
- `POST (PROTECTED: jugador)` **/agregar-a-coleccion**  
Se pasa una lista de los ids de las cartas que se quieren agregar a coleccion (pertenecientes a las cartas del juego)  
- `POST (PROTECTED: jugador)` **/agregar-mazo**  
Se pasa una lista de los ids de las cartas que se quieren agregar al nuevo mazo (pertenecientes a las cartas del juego y con la restriccion de no repetirse y ser 15 ids), se devuelve el id del mazo creado  
 
  
### /Torneo: administra el torneo  
- `POST (PROTECTED: organizador)` **/crear**
Se crea un torneo con fecha de inicio y fin, un pais, las series de cartas permitidas en el torneo y los jueces que pueden oficializarlo (la cantidad de juegos se determina por el tiempo disponible)
- `POST (PROTECTED: jugador)` **/inscribir-jugador**  
Un jugador se inscribe a un torneo (id) junto a su mazo (id) para estar en la lista de espera del torneo
- `POST (PROTECTED: organizador)` **/comenzar/{idTorneo}**  
El organizador del torneo da comienzo del torneo con esa id (solo si se llenó el cupo del torneo, aceptando todas las inscripciones pendientes)  
- `POST (PROTECTED: juez)` **/oficializar**  
El juez pasa el id del torneo, numero de juego y resultados, el endpoint se encarga de actualizar esto en db, y de ser necesario hacer los juegos de la prox ronda o terminar el torneo si fue la final del mismo
- `POST (PROTECTED: organizador)` **/editar/{idTorneo}**  
El organizador del torneo puede editar el torneo con esa id, opcionalmente se pasa una nueva lista de jueces, una nueva lista de series permitidas y una nueva cant de rondas del torneo  
- `POST (PROTECTED: organizador)` **/editar-juego/{idTorneo}/{numeroJuego}**  
El organizador del torneo puede editar el numero de juego del torneo con esa id, si el juego aun no se jugó se pueden cambiar sus jugadores por otros, si el juego ya se jugó se puede cambiar el ganador, si el juego está creado pero es de una ronda por venir no se puede cambiar
- `POST (PROTECTED: organizador)` **/rechazar-inscripcion/{idTorneo}/{idJugador}**  
Se rechaza la inscripcion del jugador inscripto, evitando que juegue el torneo (obviamente aun cuando está en fase de inscripcion)
- `POST (PROTECTED: admin, organizador)` **/cancelar/{idTorneo}**  
El admin puede cancelar el torneo con esa id  