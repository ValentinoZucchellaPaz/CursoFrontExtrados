import { useParams } from 'react-router-dom';
import './AddToCollection.css';
import { useEffect, useState } from 'react';
import { APICard } from '../../store/types';
import apiClient from '../../services/apiClient';
import { getUserCollection } from '../../services/userService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPokemons } from '../../store/slices/pokemonSlice';
import { Button, CircularProgress, Snackbar } from '@mui/joy';
import { CardSection } from '../../components/CardSection';
import { MdClose } from 'react-icons/md';
import { ScrollToTopButton } from '../../components/ScrollToTopButton';

export default function AddToCollection() {

	const [userCards, setUserCards] = useState<APICard[]>([])
	const [cardsToAdd, setCardsToAdd] = useState<APICard[]>([]) // cartas nuevas
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { userId } = useParams()
	const { items: allCards, status, error: reduxError } = useAppSelector(store => store.pokemons)
	const dispatch = useAppDispatch()

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// toast state
	const [openSuccess, setOpenSuccess] = useState(false)
	// const [openDanger, setOpenDanger] = useState(false)

	// cambiar backend para agregar cartas con una transaccion
	// si carta esta repetida en array llega el error hasta db (mejorar validacion back) (se hace validacion en front tmb)
	// meter una opcion de ver coleccion de cartas de usuario dentro de user details (desplegar dropdown)
	// mejorar la vista de cartas, mostrar nombres y centrar imagenes en card

	// funcion para agregar cartas en db
	async function handleSubmit() {
		try {
			const res = await apiClient.post<number>(`usuario/agregar-a-coleccion-de-jugador`, { idJugador: userId, cartas: cardsToAdd.map(card => card.id) }) // devuelve cant de cartas agregadas
			// actualizar estado de cartas (feedback optimista)
			setUserCards(prev => [...prev, ...cardsToAdd])
			setCardsToAdd([])
			scrollToTop()
			setOpenSuccess(true)
		} catch (err: any) {
			setError(err?.response?.data?.Detail || err?.message)
		}
	}

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

	// recuperar cartas si estado global no iniciado
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
			<h3>Agregar cartas a la coleccion del jugador {userId}</h3>
			{/* Sección: Colección actual (no clickeable) */}
			<CardSection
				title="Cartas del jugador"
				cards={userCards}
				disabled
			/>

			{/* Sección: Cartas a agregar (removibles con cruz) */}
			<CardSection
				title="Cartas seleccionadas para agregar"
				cards={cardsToAdd}
				onRemove={(id) => setCardsToAdd(prev => prev.filter(c => c.id !== id))}
				showRemove
			/>
			<Button
				onClick={handleSubmit}
				disabled={cardsToAdd.length === 0}
				variant="solid"
				color="primary"
				sx={{ mt: 2 }}
			>
				Agregar cartas
			</Button>

			{/* Sección: Todas las cartas (clickeables si no están en ninguna lista) */}
			{allCards && <CardSection
				title="Todas las cartas"
				cards={allCards}
				onAdd={(card) => {
					if (
						!userCards.some(c => c.id === card.id) &&
						!cardsToAdd.some(c => c.id === card.id)
					) {
						setCardsToAdd(prev => [...prev, card])
					}
				}}
				filterIds={[...userCards, ...cardsToAdd].map(c => c.id)}
			/>}

			{/* toast cuando se hace el envio */}
			<Snackbar
				variant="soft"
				color="success"
				autoHideDuration={4000}
				open={openSuccess}
				onClose={() => setOpenSuccess(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				endDecorator={
					<Button
						onClick={() => setOpenSuccess(false)}
						size="sm"
						variant="soft"
						color="success"
						sx={{ borderRadius: '10%' }}
					>
						<MdClose />
					</Button>
				}
			>
				Pokemons agregados exitosamente
			</Snackbar>
			<ScrollToTopButton />
		</div>
	);

};