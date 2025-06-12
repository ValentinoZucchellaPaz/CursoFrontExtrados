import { useEffect, useMemo, useState } from 'react';
import './Pokemons.css';
import { fetchPokemons } from '../../store/slices/pokemonSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PokemonsGrid } from '../../components/PokemonsGrid';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { CircularProgress } from '@mui/joy';
import { ScrollToTopButton } from '../../components/ScrollToTopButton';

const Pokemons = ({ }) => {

	const [searchTerm, setSearchTerm] = useState('')
	const { items: pokemons, status, error } = useAppSelector((state) => state.pokemons)
	const dispatch = useAppDispatch()

	const filteredPokemons = useMemo(() =>
		pokemons && pokemons.filter(pokemon =>
			pokemon.nombre.toLowerCase().includes(searchTerm.toLowerCase())
		), [pokemons, searchTerm]);

	useEffect(() => {
		if (status == "idle") {
			dispatch(fetchPokemons())
		}
	}, [status, dispatch])

	if (status === 'loading') return <div className="loader-container">
		<CircularProgress thickness={2} variant="plain" />
	</div>
	if (status === 'failed') return <div className="loader-container">
		<p>Error: {error}</p>;
	</div>
	if (status === 'succeeded' && pokemons?.length === 0) return <div className="loader-container">
		<p>Ha ocurrido un error al obtener los pokemon</p>
	</div>

	return (
		<div className='pokemons'>
			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder='Buscar pokemon por nombre'
			/>
			{filteredPokemons && <PokemonsGrid pokemons={filteredPokemons} />}
			<ScrollToTopButton />
		</div>
	);
};

export default Pokemons;