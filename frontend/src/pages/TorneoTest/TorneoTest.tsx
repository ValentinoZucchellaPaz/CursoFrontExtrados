"use client";
import useAxios from '../../hooks/useAxios';
import './TorneoTest.css';

export interface ApiCardType {
	id: number
	nombre: string
	ilustracion: string
	ataque: number
	defensa: number
}

const TorneoTest = ({ }) => {

	const { data, loading, error } = useAxios<ApiCardType>({ url: "http://localhost:5125/info/cartas/charizard", method: "GET" }) // llamado a api .net, la cual hace un llamado a db mySql, todo local (se deben levantar)
	console.log(error);


	if (loading) return <p>Cargando...</p>
	if (error) return <p>{error.message}</p>

	return (
		<div className='torneotest'>
			{/* {data?.map((pok) => <li key={pok.id}>{pok.nombre}</li>)} */}
			<p>{data?.id}: {data?.nombre}</p>
			<p>Attack: {data?.ataque}</p>
			<p>Defense: {data?.defensa}</p>
			<p><img src={data?.ilustracion} alt={data?.nombre} /></p>
		</div>
	);
};

export default TorneoTest;
