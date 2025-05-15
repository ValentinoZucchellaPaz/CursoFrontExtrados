"use client";
import React from 'react';
import './Users.css';
import useAxios from '../../hooks/useAxios';

export type UsersProps = {
	// types...
}

interface APIUserProps {
	id: number,
	alias?: string
}

const Users: React.FC<UsersProps> = ({ }) => {

	const { data: usuarios, loading, error } = useAxios<APIUserProps[]>({ url: "http://localhost:5125/info/usuarios/all" })
	console.log(usuarios);

	if (loading) return <p>Cargando...</p>
	if (error) return <p>{error.message}</p>
	return (
		<div className='users'>
			{usuarios && usuarios.map(user => <p key={user.id}>{user.id} {user?.alias}</p>)}
		</div>
	);
};

export default Users;
