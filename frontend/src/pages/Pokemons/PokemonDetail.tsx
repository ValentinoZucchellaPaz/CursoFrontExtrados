import { useParams } from "react-router-dom"
import { Card } from "../../components/Card";
import "./Pokemons.css"
import { useAppSelector } from "../../store/hooks";

export default function PokemonDetail({ }) {
    const { pokemonName } = useParams()

    // agregar un scroll to top
    // agregar estado propio al pokemon, de manera que se llama a store en use effect, se debe evitar que cuando recargue página en detail se pierde pokemons y no se llama de nuevo a api

    const pokemonsState = useAppSelector((store) => store.pokemons)
    if (pokemonsState.status === 'loading'
    ) return <p>Cargando...</p>;

    if (pokemonsState.status === 'failed' && pokemonsState.error) return <p>Error: {pokemonsState.error}</p>

    const pokemon = pokemonsState.items?.find(pok => pok.nombre === pokemonName)
    if (pokemon === undefined) return <p>No se ha encontrado el pokemon {pokemonName}</p>

    return (
        <div className="pokemon-detail-container">
            <Card
                title={pokemon.nombre}
                image={pokemon.ilustracion}
                footer={`Pokemon ID: ${pokemon.id}`}
            >
                <li>Defensa: {pokemon.defensa}</li>
                <li>Ataque: {pokemon.ataque}</li>
            </Card>
        </div>
    )
}