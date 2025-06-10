import { useParams } from 'react-router-dom';
import './AddToCollection.css';
import { useEffect, useState } from 'react';
import { APICard } from '../../store/types';
import apiClient from '../../services/apiClient';
import { getUserCollection } from '../../services/userService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPokemons } from '../../store/slices/pokemonSlice';
import { CircularProgress } from '@mui/joy';

export type AddToCollectionProps = {
	// types...
}

export default function AddToCollection() {

	const [userCards, setUserCards] = useState<APICard[]>([])
	const [newUserCards, setNewUserCards] = useState<APICard[]>([]) // cartas nuevas
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { userId } = useParams()
	const { items: allCards, status, error: reduxError } = useAppSelector(store => store.pokemons)
	const dispatch = useAppDispatch()

	// recuperar cartas de usuario
	useEffect(() => {


		async function fetchCollection() {
			try {
				setLoading(true)
				if (!userId) throw new Error("Id de usuario invalido")
				const res = await getUserCollection(userId)
				setUserCards(res.data)
			} catch (err: any) {
				setError(err?.response?.data?.Detail || err?.message)
			} finally {
				setLoading(false)
			}
		}
		fetchCollection()
	}, [])

	useEffect(() => {
		if (status == "idle") {
			dispatch(fetchPokemons())
		}
		if (status == 'failed' && reduxError) {
			setError(reduxError)
		}
	}, [status, dispatch])

	if (status === 'loading' || loading) return <div className="loader-container">
		<CircularProgress thickness={2} variant="plain" />
	</div>
	if (status === 'failed' || error) return <div className="loader-container">
		<p>Error: {error}</p>;
	</div>

	return (
		<div className='addtocollection'>
			AddToCollection works!
			coleccion actual
			{userCards && userCards.map(card => card.id)}
			{allCards && allCards.map(card => card.nombre + ', ')}
		</div>
	);
};