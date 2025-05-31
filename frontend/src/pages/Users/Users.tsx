import { useEffect, useMemo, useState } from 'react';
import './Users.css';
import { APIUserProps } from '../../store/types';
import { getUsers } from '../../services/userService';
import UserTable from '../../components/UsersTable/UsersTable';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { MdAdd } from 'react-icons/md'
import { Button, Stack } from '@mui/joy';
import { useNavigate } from 'react-router-dom';


const Users = () => {
	const [users, setUsers] = useState<APIUserProps[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const navigate = useNavigate()


	const filteredUsers = useMemo(() =>
		users && users.filter(user =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase())
		), [users, searchTerm]);


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
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 1, sm: 2, md: 4 }}>
				<SearchBar
					value={searchTerm}
					onChange={setSearchTerm}
					placeholder='Buscar usuario por nombre'
				/>
				<Button
					variant='outlined'
					startDecorator={<MdAdd />}
					sx={{
						backgroundColor: 'var(--surface)',
						color: 'var(--text)',
						'&:hover': {
							backgroundColor: 'var(--primary-dark)'
						}
					}}
					onClick={() => navigate('/create-user')}>Crear usuario</Button>
			</Stack>



			{filteredUsers && <UserTable users={filteredUsers} />}
		</div>
	);
};

export default Users;
