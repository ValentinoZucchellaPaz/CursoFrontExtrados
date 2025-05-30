import { useEffect } from 'react';
import './Pokemons.css';
import { fetchPokemons } from '../../store/slices/pokemon/pokemonSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Card } from '../../components/Card';

const Pokemons = ({ }) => {

	const navigate = useNavigate()
	const { items: pokemons, status, error } = useAppSelector((state) => state.pokemons)
	const dispatch = useAppDispatch()

	useEffect(() => {
		console.log("use effect de posts");
		console.log(status);
		console.log(pokemons);


		if (status == "idle") {
			dispatch(fetchPokemons())
			// ver de hacer un fetch de mas datos para al menos tener cosas que mostrar en la imagen
		}
	}, [status, dispatch])

	if (status === 'loading') return <p>Cargando...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;
	if (status === 'succeeded' && pokemons?.length === 0) return <p>Ha ocurrido un error al obtener los pokemon</p>

	return (
		<div className='pokemons'>
			<ul className='pokemon-grid'>
				{pokemons?.map(pokemon => <Card title={pokemon.nombre} footer={"Pokemon ID: " + pokemon.id} image={pokemon.ilustracion} onClick={() => navigate(`/pokemons/${pokemon.nombre}`)} />)}
			</ul>
		</div>
	);
};

export default Pokemons;