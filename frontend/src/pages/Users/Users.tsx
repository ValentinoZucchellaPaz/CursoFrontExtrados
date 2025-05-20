import React from 'react';
import './Users.css';
import useAxios from '../../hooks/useAxios';
import { APIUserProps } from '../../store/types';
import { useNavigate } from 'react-router-dom';

export type UsersProps = {
	// types...
}


const Users: React.FC<UsersProps> = ({ }) => {
	const navigate = useNavigate()

	const { data: usuarios, loading, error } = useAxios<APIUserProps[]>({ url: "http://localhost:5125/info/usuarios/all" })
	console.log(usuarios);

	if (loading) return <p>Cargando...</p>
	if (error) return <p>{error.message}</p>
	return (
		<div className='users'>
			{usuarios && usuarios.map(user => <p onClick={() => navigate(`/users/${user.id}`)} key={user.id}>{user.id} {user.alias} {user.email} {user.name} {user.role}</p>)}
		</div>
	);
};

export default Users;
