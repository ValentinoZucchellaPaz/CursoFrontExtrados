import { useParams } from "react-router-dom"
import useAxios from "../../hooks/useAxios"
import useFetch from "../../hooks/useFetch";
import { Pokemon } from "../../store/slices/pokemon/types";
import { request } from "../../services/request";

export default function PokemonDetail({ }) {
    const { pokemonName } = useParams()

    // const { data: pokemon, loading, error } = useFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

    const { data: pokemon, loading, error } = useAxios<Pokemon>({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`, method: "GET" })
    console.log(pokemon);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h4>Id: {pokemon?.id}</h4>
            <h4>Name: {pokemon?.name}</h4>
            <h4>Types: </h4>
            {pokemon?.types && pokemon.types.map(type =>
                type.type.name
            ).join(", ")}
            <h4>Stats</h4>
            <ul>
                {pokemon?.stats && pokemon.stats.map(stat => (
                    <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                ))}
            </ul>
            <img src={pokemon?.sprites.front_default} alt={pokemon?.name} />
        </div>
    )
}