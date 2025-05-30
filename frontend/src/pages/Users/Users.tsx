import { useEffect, useMemo, useState } from 'react';
import './Users.css';
import { APIUserProps } from '../../store/types';
import { getUsers } from '../../services/userService';
import UserTable from '../../components/UsersTable/UsersTable';
import { SearchBar } from '../../components/SearchBar/SearchBar';


const Users = () => {
	const [users, setUsers] = useState<APIUserProps[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')


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
			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				placeholder='Buscar usuario por nombre'
			/>

			{filteredUsers && <UserTable users={filteredUsers} />}
		</div>
	);
};

export default Users;
