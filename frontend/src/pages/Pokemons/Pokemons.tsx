"use client";
import { useEffect } from 'react';
import './Pokemons.css';
import { fetchPokemons } from '../../store/slices/pokemon/pokemonSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

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
		}
	}, [status, dispatch])

	if (status === 'loading') return <p>Cargando...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;

	return (
		<div className='pokemons'>
			<ul>
				{pokemons?.results ? pokemons.results.map(pokemon =>
					<li key={pokemon.url} style={{ cursor: "pointer" }} onClick={() => navigate(`/pokemons/${pokemon.name}`)}>{pokemon.name}</li>
				) : <p>Loading...</p>}
			</ul>
		</div>
	);
};

export default Pokemons;