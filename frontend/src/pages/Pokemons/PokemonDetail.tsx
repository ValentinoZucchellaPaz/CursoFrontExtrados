import { useParams } from "react-router-dom"
import useAxios from "../../hooks/useAxios"
import { Pokemon } from "../../store/slices/pokemon/types";
import { ApiCardType } from "../TorneoTest/TorneoTest";

export default function PokemonDetail({ }) {
    const { pokemonName } = useParams()


    // const url = `http://localhost:5125/info/cartas/${pokemonName}` // usando db de backend .net
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}` // usando pokeapi

    // const { data: pokemon, loading, error } = useFetch<Pokemon>(url) // usando useFetch
    // const { data: pokemon, loading, error } = useAxios<ApiCardType>({ url, method: "GET" })
    const { data: pokemon, loading, error } = useAxios<Pokemon>({ url, method: "GET" })
    console.log(pokemon);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h4>Id: {pokemon?.id}</h4>
            {/* <h4>Name: {pokemon?.nombre}</h4> */}
            <h4>Name: {pokemon?.name}</h4>
            {/* <h4>Types: </h4>
            {pokemon?.types && pokemon.types.map(type =>
                type.type.name
            ).join(", ")} */}
            <h4>Stats</h4>
            <ul>
                {pokemon?.stats && pokemon.stats.map(stat => (
                    <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                ))}
                {/* <li>Attack: {pokemon?.ataque}</li>
                <li>Defense: {pokemon?.defensa}</li> */}
            </ul>
            <img src={pokemon?.sprites.front_default} alt={pokemon?.name} />
            {/* <img src={pokemon?.ilustracion} alt={pokemon?.nombre} /> */}
        </div>
    )
}