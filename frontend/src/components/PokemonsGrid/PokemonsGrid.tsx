"use client";
import React from 'react';
import './PokemonsGrid.css';
import { APICard } from '../../store/types';
import { useNavigate } from 'react-router-dom';
import { Card } from '../Card';

export type PokemonsGridProps = {
	pokemons: APICard[]
}

const PokemonsGrid: React.FC<PokemonsGridProps> = ({ pokemons }) => {
	const navigate = useNavigate()
	return (
		<ul className='pokemon-grid'>
			{pokemons?.map(pokemon => <Card title={pokemon.nombre} footer={"Pokemon ID: " + pokemon.id} image={pokemon.ilustracion} onClick={() => navigate(`/pokemons/${pokemon.nombre}`)} />)}
		</ul>
	);
};

export default PokemonsGrid;
