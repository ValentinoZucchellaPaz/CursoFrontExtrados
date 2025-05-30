import { useNavigate, useParams } from "react-router-dom"
import { Card } from "../../components/Card";
import "./Pokemons.css"
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { fetchPokemons } from "../../store/slices/pokemonSlice";
import { MdArrowBack } from "react-icons/md";

export default function PokemonDetail({ }) {
    const { pokemonName } = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const pokemonsState = useAppSelector((store) => store.pokemons)

    // scroll to top cuando renderize
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (pokemonsState.status === 'idle') {
            dispatch(fetchPokemons())
        }
    }, [pokemonsState])

    if (pokemonsState.status === 'loading'
    ) return <p>Cargando...</p>;

    if (pokemonsState.status === 'failed' && pokemonsState.error) return <p>Error: {pokemonsState.error}</p>

    const pokemon = pokemonsState.items?.find(pok => pok.nombre === pokemonName)
    if (pokemon === undefined) return <p>No se ha encontrado el pokemon {pokemonName}</p>

    return (
        <div className="pokemon-detail-container">
            <button onClick={() => navigate(-1)}><MdArrowBack /></button>
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