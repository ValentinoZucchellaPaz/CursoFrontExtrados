import {
	Table,
	Sheet,
	Typography,
	IconButton,
	Box,
	Modal,
	ModalDialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/joy';
import { MdEdit, MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import { APIUserProps } from '../../store/types';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { deleteValidations } from '../../utils/validations';
import { deleteUser } from '../../services/userService';
export default function UserTable({ users, setUsers }: { users: APIUserProps[], setUsers: React.Dispatch<React.SetStateAction<APIUserProps[] | null>> }) {
	const [openModal, setOpenModal] = useState(false)
	const [userToDelete, setUserToDelete] = useState<APIUserProps | null>(null)
	const navigate = useNavigate();

	// validaciones y metodo para eliminar usuario
	const loggedUser = useAppSelector((store) => store.auth)
	const canDeleteEdit = userToDelete ? deleteValidations(loggedUser, userToDelete) : false
	const handleDelete = async () => {
		if (!canDeleteEdit) return; // seguridad extra
		try {
			userToDelete?.id && await deleteUser(userToDelete.id.toLocaleString())
			setUserToDelete(null)
			setUsers(prev => prev?.filter(u => u.id !== userToDelete?.id) || [])
			setOpenModal(false)
		} catch (error: any) {
			console.error("Error al eliminar usuario:", error);
			// mostrar toast
		}
	};

	return (
		<>
			<Sheet variant="outlined" sx={{ borderRadius: 'md', p: 2, backgroundColor: 'var(--surface)', color: 'var(--text)', overflowX: 'auto' }}>
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
							<th style={{ width: '60px', whiteSpace: 'nowrap' }}>ID</th>
							<th className='hide-mobile'>Alias</th>
							<th>Nombre</th>
							<th>Rol</th>
							<th className='hide-mobile'>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u) => (
							<tr key={u.id} onClick={() => navigate(`/users/${u.id}`)}>
								<td>{u.id}</td>
								<td className='hide-mobile'>{u.alias ? u.alias : '-'}</td>
								<td>{u.name}</td>
								<td>{u.role}</td>
								<td className='hide-mobile'>
									<Box sx={{ display: 'flex', gap: 1 }}>
										<IconButton
											variant="soft"
											color="neutral"
											disabled={u.role === 'admin'}
											onClick={(e) => {
												e.stopPropagation()
												navigate(`/users/${u.id}/editar`)
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
												setUserToDelete(u)
												setOpenModal(true)
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
			<Modal open={openModal} onClose={() => setOpenModal(false)}>
				<ModalDialog variant="outlined" role="alertdialog"
					sx={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
					<DialogTitle>¿Estás seguro?</DialogTitle>
					<DialogContent>
						Esta acción eliminará permanentemente al usuario <strong>{userToDelete?.alias}</strong>
					</DialogContent>
					<DialogActions>
						<Button variant="plain" onClick={() => setOpenModal(false)}>Cancelar</Button>
						<Button
							variant="solid"
							color="danger"
							onClick={handleDelete}
						>
							Confirmar
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</>
	);
}
