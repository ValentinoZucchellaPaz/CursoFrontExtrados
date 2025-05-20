import { useParams } from "react-router-dom"
import { Pokemon } from "../../store/slices/pokemon/types";
import useFetch from "../../hooks/useFetch";
import { Card } from "../../components/Card";
import { ApiCardType } from "../TorneoTest/TorneoTest";
import "./Pokemons.css"

export default function PokemonDetail({ }) {
    const { pokemonName } = useParams()


    // const url = `http://localhost:5125/info/cartas/${pokemonName}` // usando db de backend .net
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}` // usando pokeapi

    // TODO: para la descripcion hay que llamar a otro endpoint https://pokeapi.co/api/v2/pokemon-species/{species_number/name}/

    const { data: pokemon, loading, error } = useFetch<Pokemon>(url) // usando useFetch
    // const { data: pokemon, loading, error } = useAxios<ApiCardType>({ url, method: "GET" }) // cambia el tipo que retorna
    // const { data: pokemon, loading, error } = useAxios<Pokemon>({ url, method: "GET" })
    console.log(pokemon);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!pokemon) return <p>No pokemon</p>

    return (
        <div className="pokemon-detail-container">
            <Card
                title={pokemon.name}
                image={pokemon.sprites.front_default}
                footer={`Pokemon ID: ${pokemon.id}`}
            >
                {pokemon.stats.map(stat =>
                    <li key={pokemon.id}>{stat.stat.name}: {stat.base_stat}</li>
                )}
            </Card>
        </div>
    )
}