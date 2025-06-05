import './PokemonsGrid.css';
import { APICard } from '../../store/types';
import { useNavigate } from 'react-router-dom';
import { Card } from '../Card';

export type PokemonsGridProps = {
	pokemons: APICard[]
}

const PokemonsGrid = ({ pokemons }: PokemonsGridProps) => {
	const navigate = useNavigate()
	return (
		<ul className='pokemon-grid'>
			{pokemons?.map(pokemon => <Card key={pokemon.nombre} title={pokemon.nombre} footer={"Pokemon ID: " + pokemon.id} image={pokemon.ilustracion} onClick={() => navigate(`/pokemons/${pokemon.nombre}`)} />)}
		</ul>
	);
};

export default PokemonsGrid;
