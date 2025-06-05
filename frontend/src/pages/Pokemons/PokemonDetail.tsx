import { useNavigate, useParams } from "react-router-dom"
import { Card } from "../../components/Card";
import "./Pokemons.css"
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { fetchPokemons } from "../../store/slices/pokemonSlice";
import { MdArrowBack } from "react-icons/md";
import { CircularProgress } from "@mui/joy";

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
    ) return <div className="loader-container">
        <CircularProgress thickness={2} variant="plain" />
    </div>

    if (pokemonsState.status === 'failed' && pokemonsState.error) return <div className="loader-container">
        <p>Error: {pokemonsState.error}</p>
    </div>

    const pokemon = pokemonsState.items?.find(pok => pok.nombre === pokemonName)
    if (pokemon === undefined) return <p>No se ha encontrado el pokemon {pokemonName}</p>

    return (
        <div className="pokemon-detail-container">
            <button onClick={() => navigate(-1)}><MdArrowBack color='var(--primary)' /></button>
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