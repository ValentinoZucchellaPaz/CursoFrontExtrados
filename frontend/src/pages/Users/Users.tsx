import { useEffect, useMemo, useState } from 'react';
import './Users.css';
import { APIUserProps } from '../../store/types';
import { getUsers } from '../../services/userService';
import UserTable from '../../components/UsersTable/UsersTable';
import { Input } from '@mui/joy';
import { MdSearch } from 'react-icons/md';


const Users = () => {
	const [users, setUsers] = useState<APIUserProps[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [debounceSearch, setDebouncedSearch] = useState('')

	// debounce de barra de busqueda
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearch(searchTerm);
		}, 400); // 400ms de retardo

		return () => clearTimeout(timeoutId); // Limpia si escribe otra letra rápido
	}, [searchTerm]);

	const filteredUsers = useMemo(() =>
		users && users.filter(user =>
			user.name.toLowerCase().includes(debounceSearch.toLowerCase())
		), [users, debounceSearch]);


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
			<Input
				placeholder="Buscar usuario..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				startDecorator={<MdSearch />}
				sx={{ mb: 2, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
			/>

			{filteredUsers && <UserTable users={filteredUsers} />}
		</div>
	);
};

export default Users;
