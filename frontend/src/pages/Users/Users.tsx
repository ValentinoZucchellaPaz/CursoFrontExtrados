import React, { useEffect, useState } from 'react';
import './Users.css';
import useAxios from '../../hooks/useAxios';
import { APIUserProps } from '../../store/types';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { deleteUser, getUsers } from '../../services/userService';


const Users = () => {
	const navigate = useNavigate()
	const [users, setUsers] = useState<APIUserProps[] | null>(null) // además hacer estado global con usuario en cuestión
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		setLoading(true)
		getUsers()
			.then(res => res.data)
			.then(data => setUsers(data))
			.catch(e => setError(e.message))
			.finally(() => setLoading(false))

	}, [])

	if (loading) return <p>Cargando...</p>
	if (error) return <p>{error}</p>
	return (
		<div className='users'>
			{users && users.map(user => <Card onClick={() => navigate(`/users/${user.id}`)} key={user.id} title={`id:${user.id} ${user.alias ? 'alias: ' + user.alias : 'nombre: ' + user.name}`} footer={user.role}>
				<button onClick={(e) => {
					e.stopPropagation()
					deleteUser(user.id.toString())
				}}>eliminar</button>
			</Card>)}
		</div>
	);
};

export default Users;
