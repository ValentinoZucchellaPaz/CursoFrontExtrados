import {
	Table,
	Sheet,
	Typography,
	IconButton,
	Box,
} from '@mui/joy';
import { MdEdit, MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import { APIUserProps } from '../../store/types';
export default function UserTable({ users }: { users: APIUserProps[] }) {
	const navigate = useNavigate();

	return (
		<Sheet variant="outlined" sx={{ borderRadius: 'md', p: 2, backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
			<Typography level="h4" mb={2} sx={{ color: 'var(--text)' }}>
				Lista de Usuarios
			</Typography>

			<Table
				variant="plain"
				borderAxis="xBetween"
				hoverRow
				sx={{
					backgroundColor: 'var(--surface)',
					color: 'var(--text)',
					'& thead th': { color: 'var(--text)' },
					'& tbody tr:hover': {
						backgroundColor: 'var(--primary-dark)',
						cursor: 'pointer'
					}
				}}
			>
				<thead>
					<tr>
						<th>ID</th>
						<th>Alias</th>
						<th>Nombre</th>
						<th>Rol</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{users.map((u) => (
						<tr key={u.id} onClick={() => navigate(`/users/${u.id}`)}>
							<td>{u.id}</td>
							<td>{u.alias ? u.alias : '-'}</td>
							<td>{u.name}</td>
							<td>{u.role}</td>
							<td>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<IconButton
										variant="soft"
										color="neutral"
										disabled={u.role === 'admin'}
										onClick={(e) => {
											e.stopPropagation()
											navigate(`/usuarios/${u.id}/editar`)
										}}
									>
										<MdEdit />
									</IconButton>
									<IconButton
										variant="soft"
										color="danger"
										disabled={u.role === 'admin'}
										onClick={(e) => {
											e.stopPropagation()
											navigate(`/usuarios/${u.id}/eliminar`)
										}}
									>
										<MdDelete />
									</IconButton>
								</Box>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Sheet>
	);
}
