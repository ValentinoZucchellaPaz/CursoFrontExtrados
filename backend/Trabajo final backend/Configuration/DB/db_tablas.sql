xDROP DATABASE IF EXISTS torneo_cartas;
CREATE DATABASE torneo_cartas;
USE torneo_cartas;

DROP TABLE if EXISTS inscripcion_jugadores;
DROP TABLE if EXISTS descalificaciones;
DROP TABLE if EXISTS jueces_oficializadores;
DROP TABLE if EXISTS series_torneos;
DROP TABLE if EXISTS juegos;
DROP TABLE if EXISTS torneos;
DROP TABLE if EXISTS cartas_por_mazo;
DROP TABLE if EXISTS mazos;
DROP TABLE if EXISTS colecciones_cartas;
DROP TABLE if EXISTS usuarios;

-- se debe hacer la carga de datos con los scripts .py que se encuentran en la carpeta
DROP TABLE if EXISTS cartas_por_serie;
DROP TABLE if EXISTS series;
DROP TABLE if EXISTS cartas;
DROP TABLE if EXISTS paises;


-- CARTAS Y SERIES
CREATE TABLE Cartas (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nombre VARCHAR(100) UNIQUE NOT NULL,
   ilustracion VARCHAR(100) NOT NULL,
   ataque INT NOT NULL,
   defensa INT NOT NULL
);

CREATE TABLE Series (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100) NOT NULL,
	fecha_salida DATE NOT NULL
);

CREATE TABLE cartas_por_serie (
	id_carta INT NOT NULL,
	id_serie INT NOT NULL,
	
	PRIMARY KEY(id_carta, id_serie),
	FOREIGN KEY (id_carta) REFERENCES cartas(id),
	FOREIGN KEY (id_serie) REFERENCES series(id)
);


-- PAISES
CREATE TABLE paises (
	codigo VARCHAR(5) NOT NULL,
	nombre VARCHAR(100) PRIMARY KEY NOT NULL -- pais+-utfoffset
);

-- USUARIOS Y ROLES: jugador, juez, organizador, administrador
CREATE TABLE Usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	pais VARCHAR(50) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	contraseña CHAR(128) NOT NULL,
	salt CHAR(128) NOT NULL,
	role ENUM('admin', 'jugador', 'juez', 'organizador') NOT NULL,
	id_creador INT NULL,
	alias VARCHAR(50) UNIQUE NULL,
	avatar VARCHAR(100) NULL, -- recomendable 2083
	activo BOOLEAN NOT NULL,
	
	FOREIGN KEY (id_creador) REFERENCES usuarios(id),
	FOREIGN KEY (pais) REFERENCES paises(nombre)
);

-- MAZOS Y COLECCIONES
CREATE TABLE Mazos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
	
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE cartas_por_mazo (
	id_carta INT NOT NULL,
	id_mazo INT NOT NULL,
	
	FOREIGN KEY (id_carta) REFERENCES cartas(id),
	FOREIGN KEY (id_mazo) REFERENCES  mazos(id),
	PRIMARY KEY(id_mazo, id_carta) -- no se puede tener cartas duplicadas en los mazos
);

CREATE TABLE colecciones_cartas (
	id_usuario INT NOT NULL,
	id_carta INT NOT NULL,

	PRIMARY KEY (id_usuario, id_carta),
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
	FOREIGN KEY (id_carta) REFERENCES cartas(id)
);


-- TORNEOS Y JUEGOS
CREATE TABLE Torneos (
	id INT PRIMARY KEY AUTO_INCREMENT,
	fecha_inicio DATETIME NOT NULL,
	cant_dias INT NOT NULL,
	horas_por_dia INT NOT NULL,
	pais VARCHAR(50) NOT NULL,
	fase ENUM('inscripcion', 'torneo', 'finalizado', 'cancelado') NOT NULL,
	cant_rondas INT NOT NULL, -- ej 6 rondas, entonces los juegos tienen n° ronda 6, 5, ... , 1 (final)
	id_organizador INT NOT NULL,
	-- id ganador se calc del juegos
	
	FOREIGN KEY (id_organizador) REFERENCES usuarios(id),
	FOREIGN KEY (pais) REFERENCES paises(nombre)
);

CREATE TABLE series_torneos ( -- relaciona las series disponibles para los torneos
	id_serie INT NOT NULL,
	id_torneo INT NOT NULL,
	
	PRIMARY KEY (id_serie, id_torneo),
	FOREIGN KEY (id_torneo) REFERENCES torneos(id),
	FOREIGN KEY (id_serie) REFERENCES series(id)
);


CREATE TABLE Juegos(
	id INT PRIMARY KEY AUTO_INCREMENT,
	fecha_inicio DATETIME NOT NULL,
	id_juez int NULL, -- juez pone su id cuando oficializa
	id_torneo INT NOT NULL,
	numero_juego INT NOT NULL, -- con esto se calcula ronda actual, el ultimo juego es la final
	id_jugador_a INT NULL, -- se ponen cuando se cierre la inscripcion
	id_jugador_b INT NULL,
	id_ganador INT NULL, -- ganador de juego ronda 1 es ganador de torneo
	
	-- check para que id ganador sea null, jugador_a o b
	CONSTRAINT id_ganador_valido CHECK (
		id_ganador IS NULL
		OR id_ganador = id_jugador_a
		OR id_ganador = id_jugador_b
	),
	FOREIGN KEY (id_torneo) REFERENCES torneos(id),
	FOREIGN KEY (id_ganador) REFERENCES usuarios(id),
	FOREIGN KEY (id_jugador_a) REFERENCES usuarios(id),
	FOREIGN KEY (id_jugador_b) REFERENCES usuarios(id),
	FOREIGN KEY (id_juez) REFERENCES usuarios(id)
);

CREATE TABLE descalificaciones(
	id_usuario INT NOT NULL,
	id_juego INT NOT NULL,
	razon VARCHAR(150) NOT NULL,

	PRIMARY KEY (id_usuario, id_juego),
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
	FOREIGN KEY (id_juego) REFERENCES juegos(id)
);

CREATE TABLE inscripcion_jugadores(
	id_jugador INT NOT NULL,
	id_torneo INT NOT NULL,
	id_mazo INT NOT NULL,
	aceptado BOOL NULL,
	
	PRIMARY KEY (id_jugador, id_torneo),
	FOREIGN KEY (id_jugador) REFERENCES usuarios(id),
	FOREIGN KEY (id_torneo) REFERENCES torneos(id),
	FOREIGN KEY (id_mazo) REFERENCES mazos(id)
);

CREATE TABLE jueces_oficializadores(
	id_juez INT NOT NULL,
	id_torneo INT NOT NULL,
	
	PRIMARY KEY (id_juez, id_torneo),
	FOREIGN KEY (id_torneo) REFERENCES torneos(id),
	FOREIGN KEY (id_juez) REFERENCES usuarios(id)
);


-- ejecuta script para cargar datos, x eso no pasa de aca

-- primer usuario en db
INSERT INTO Usuarios (nombre, pais, email, contraseña, salt, ROLE, activo)
VALUES (
	'Admin1', 
	'Argentina-03:00', 
	'admin1@example.com',
	'5F4278A9C8524F8D77D5F3C1FF6C2710EDA594CBE6103B928F9DD6674CCC759A13B44F9ECF3CA7D3A4AAA0593E4A3A5A58703059DA4E9DEF1E98E560545A34C2', -- 123456
	'741819387CBE454D7C3AB1DC737FBFF0705E9B4C5947B1D68CA9847DADE98832C6D547126F55C4ABFBD5E5B341BEF53A98600C8F4C9AD3B966E0CF1DFBF95F36',
	'admin',
	TRUE
);

DROP TABLE if EXISTS refresh_tokens;
CREATE TABLE refresh_tokens (
	id INT PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL,
	token CHAR(50) NOT NULL,
	expiration_date TIMESTAMP NOT NULL,
	is_revoked BOOL NOT NULL,
	
	FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

SELECT * FROM refresh_tokens

SELECT * FROM cartas;
SELECT * FROM series;
SELECT * FROM cartas_por_serie;
SELECT * FROM cartas c WHERE
	c.id NOT IN (SELECT cps.id_carta FROM cartas_por_serie cps); -- comprobar que no quedan cartas sin serie
SELECT * FROM paises;

SELECT * FROM colecciones_cartas;
SELECT * FROM cartas_por_mazo;
SELECT * FROM usuarios;

SELECT * FROM mazos;
SELECT * FROM torneos;
SELECT * FROM juegos;
SELECT * FROM jueces_oficializadores;
SELECT * FROM series_torneos;
SELECT * FROM inscripcion_jugadores;

update inscripcion_jugadores set aceptado=null where id_torneo=10 and aceptado IS not NULL;

UPDATE juegos SET id_juez=NULL, id_ganador=NULL WHERE id_torneo=2 AND numero_juego=6;
UPDATE torneos SET fase='inscripcion' WHERE id=10;

DELETE FROM series_torneos;
DELETE FROM jueces_oficializadores;
DELETE FROM inscripcion_jugadores;
DELETE FROM juegos;
DELETE FROM torneos;
DELETE FROM colecciones_cartas;
DELETE FROM cartas_por_mazo;
DELETE FROM mazos;
DELETE FROM usuarios WHERE ROLE='jugador';
		
		
		
		
		
		
		
		
		
		
		
		
		