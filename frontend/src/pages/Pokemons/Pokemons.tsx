import { useEffect, useMemo, useState } from 'react';
import './Pokemons.css';
import { fetchPokemons } from '../../store/slices/pokemonSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PokemonsGrid } from '../../components/PokemonsGrid';
import { SearchBar } from '../../components/SearchBar/SearchBar';

const Pokemons = ({ }) => {

	const [searchTerm, setSearchTerm] = useState('')
	const { items: pokemons, status, error } = useAppSelector((state) => state.pokemons)
	const dispatch = useAppDispatch()

	const filteredPokemons = useMemo(() =>
		pokemons && pokemons.filter(pokemon =>
			pokemon.nombre.toLowerCase().includes(searchTerm.toLowerCase())
		), [pokemons, searchTerm]);

	useEffect(() => {
		console.log("use effect de posts");
		console.log(status);
		console.log(pokemons);


		if (status == "idle") {
			dispatch(fetchPokemons())
		}
	}, [status, dispatch])

	if (status === 'loading') return <p>Cargando...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;
	if (status === 'succeeded' && pokemons?.length === 0) return <p>Ha ocurrido un error al obtener los pokemon</p>

	return (
		<div className='pokemons'>
			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder='Buscar pokemon por nombre'
			/>
			{filteredPokemons && <PokemonsGrid pokemons={filteredPokemons} />}
		</div>
	);
};

export default Pokemons;