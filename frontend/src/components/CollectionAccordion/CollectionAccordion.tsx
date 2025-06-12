"use client";
import React, { useEffect, useState } from 'react';
import './CollectionAccordion.css';
import { APICard } from '../../store/types';
import { getUserCollection } from '../../services/userService';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy';
import { MdExpandMore } from 'react-icons/md';

export type CollectionAccordionProps = {
	// types...
}

export default function CollectionAccordion({ userId }: { userId: number }) {
	// acordion con cartas de usuario
	const [expanded, setExpanded] = useState(false);
	const [collection, setCollection] = useState<APICard[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (expanded && (!collection || collection?.length === 0)) {
			setLoading(true);
			getUserCollection(userId.toString())
				.then(res => res.data)
				.then(data => setCollection(data))
				.catch(err => setError(err?.response?.data?.Detail || err.message))
				.finally(() => setLoading(false));
		}
	}, [expanded]);


	return (
		<Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
			<AccordionSummary indicator={<MdExpandMore />}>
				<Typography level="title-md">Colección de cartas</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{loading && <p>Cargando colección...</p>}
				{error && <p>Error al cargar colección: {error}</p>}
				{collection?.length && collection.length > 0 ? (
					<ul>
						{collection.map(card => (
							<li key={card.id}>{card.nombre}</li>
						))}
					</ul>
				) : !loading ? (
					<p>No tiene cartas en su colección.</p>
				) : null}
			</AccordionDetails>
		</Accordion>
	)
};