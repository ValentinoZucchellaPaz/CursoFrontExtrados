import requests
import random
import mysql.connector
from pydantic import BaseModel
from typing import List
from datetime import datetime
import time;

# TIPOS DE POKEMON

class Stat(BaseModel):
    name:str

class PokemonStat(BaseModel):
    base_stat: int
    stat: Stat

class PokemonSprite(BaseModel):
    front_default:str

class Pokemon(BaseModel):
    id:int
    name:str
    stats: list[PokemonStat]
    sprites: PokemonSprite

class PokemonSpecies(BaseModel):
    name:str
    url:str

class ApiRes(BaseModel):
    results: List[PokemonSpecies]

class DbPokemon(BaseModel):
    id:int
    nombre:str
    ilustracion:str
    ataque:int
    defensa:int

# TIPOS DE SERIES

class PokeSet(BaseModel):
    id:str
    name: str
    series: str
    releaseDate: str

class SetApiRes(BaseModel):
    data: List[PokeSet]

class DbSerie(BaseModel):
    nombre:str
    fecha_salida: str


def fetch_1st_gen()->List[DbPokemon]:
    res = requests.get('https://pokeapi.co/api/v2/pokemon-species/?limit=151')
    res.raise_for_status()
    api_res = ApiRes.model_validate(res.json())
    db_pokemons:List[DbPokemon] = []
    for pokemon in api_res.results:
        poke_res = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pokemon.name}')
        poke_res.raise_for_status()
        pokemon = Pokemon.model_validate(poke_res.json())
        db_pokemons.append(DbPokemon(
            id=pokemon.id,
            nombre=pokemon.name,
            ilustracion=pokemon.sprites.front_default,
            ataque=pokemon.stats[1].base_stat,
            defensa=pokemon.stats[2].base_stat
        ))
        
    return db_pokemons

def fetch_series()->List[DbSerie]:
    res=requests.get('https://api.pokemontcg.io/v2/sets')
    res.raise_for_status()
    api_res = SetApiRes.model_validate(res.json())
    db_series_names: List[str] = []
    db_series: List[DbPokemon] = []
    for set in api_res.data:
        serie = DbSerie(nombre=set.series, fecha_salida=set.releaseDate)
        if serie.nombre not in db_series_names:
            db_series_names.append(serie.nombre)
            db_series.append(serie)
    return db_series

# asigna aleatoreamente los 151 primeros pokemon a cada serie (30 x serie)
# cambiar asi no quedan cartas sin asignar
def generate_cartas_de_serie():
    # db config
    connection = mysql.connector.connect(
        host="localhost",
        user="admin",
        password="24122002",
        database="torneo_cartas"
    )
    cursor = connection.cursor()
    query = """
    INSERT INTO cartas_por_serie (id_carta, id_serie)
    VALUES (%s, %s)
    """

    # GENERAR CARTAS/SERIE

    cartas = list(range(1, 152))
    series = list(range(1, 11))
    cartas_por_serie = 30
    asignaciones = []
    cartas_asignadas = {id_carta: False for id_carta in cartas} # seguimiento de asignaciones

    # 1. Reparto inicial: Garantizar que todas las cartas se asignen al menos una vez
    for id_carta in cartas:
        # Seleccionar una serie aleatoria para cada carta
        id_serie = random.choice(series)
        asignaciones.append((id_serie, id_carta))
        cartas_asignadas[id_carta] = True

    # 2. Llenar las series hasta completar las 30 cartas por serie
    for id_serie in series:
        # cartas ya asignadas a esta serie
        cartas_en_serie = {id_carta for s, id_carta in asignaciones if s == id_serie}
        faltantes = cartas_por_serie - len(cartas_en_serie)
        
        # seleccionar cartas adicionales sin repetir
        cartas_disponibles = list(set(cartas) - cartas_en_serie)
        cartas_adicionales = random.sample(cartas_disponibles, faltantes)
        
        # agregar cartas adicionales
        asignaciones.extend((id_serie, id_carta) for id_carta in cartas_adicionales)
    
    # # Verificar resultados
    # print(f"Total asignaciones: {len(asignaciones)}")
    # print(asignaciones[:10])  # Muestra las primeras 10 asignaciones

    # # Validación: Contar cuántas veces aparece cada carta
    # conteo_cartas = {id_carta: 0 for id_carta in cartas}
    # for _, id_carta in asignaciones:
    #     conteo_cartas[id_carta] += 1

    # print("Distribución de asignaciones por carta:")
    # print({carta: veces for carta, veces in conteo_cartas.items() if veces > 1})

    # subir a db
    for id_serie, id_carta in asignaciones:
        cursor.execute(query, (id_carta, id_serie))

    # mandar transaccion y cerrar conexion
    connection.commit()
    cursor.close()
    connection.close()

def save_in_database(pokemon_data:List[DbPokemon], series_data:List[DbSerie]):
    # config
    connection = mysql.connector.connect(
        host="localhost",
        user="admin",
        password="24122002",
        database="torneo_cartas"
    )
    cursor = connection.cursor()
    
    # cargar pokemons
    query_pokemons = """
    INSERT INTO cartas (nombre, ilustracion, ataque, defensa)
    VALUES (%s, %s, %s, %s)
    """
    for pokemon in pokemon_data:
        cursor.execute(query_pokemons, (pokemon.nombre, pokemon.ilustracion, pokemon.ataque, pokemon.defensa))

    # cargar series
    query_series="""
    INSERT INTO series (nombre, fecha_salida)
    VALUES (%s, %s)
    """
    for serie in series_data:
        cursor.execute(query_series, (serie.nombre, datetime.strptime(serie.fecha_salida, "%Y/%m/%d").date()))
    
    
    # mandar transaccion y cerrar conexion
    connection.commit()
    cursor.close()
    connection.close()


def main():
    inicio = time.time()
    series = fetch_series()
    pokemon = fetch_1st_gen()
    save_in_database(pokemon_data=pokemon, series_data=series[:10])
    generate_cartas_de_serie()
    fin = time.time()
    tiempo_ejecucion = fin - inicio
    print(f"done in: {tiempo_ejecucion}")

if __name__ == "__main__":
    main()
