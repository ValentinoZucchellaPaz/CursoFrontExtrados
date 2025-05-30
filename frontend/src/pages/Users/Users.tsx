import React from 'react';
import './Users.css';
import useAxios from '../../hooks/useAxios';
import { APIUserProps } from '../../store/types';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { deleteUser } from '../../services/userService';

export type UsersProps = {
	// types...
}


const Users: React.FC<UsersProps> = ({ }) => {
	const navigate = useNavigate()

	const { data: usuarios, loading, error } = useAxios<APIUserProps[]>({ url: "http://localhost:5125/info/usuarios/all" }) // cambiar a hook personalizado para llamar a usuarios useUsers
	// meto en useeffect para que cuando borre usuario llame de nuevo?
	console.log(usuarios);

	if (loading) return <p>Cargando...</p>
	if (error) return <p>{error.message}</p>
	return (
		<div className='users'>
			{usuarios && usuarios.map(user => <Card onClick={() => navigate(`/users/${user.id}`)} key={user.id} title={`id:${user.id} ${user.alias ? 'alias: ' + user.alias : 'nombre: ' + user.name}`} footer={user.role}>
				<button onClick={(e) => {
					e.stopPropagation()
					deleteUser(user.id.toString())
				}}>eliminar</button>
			</Card>)}
		</div>
	);
};

export default Users;
