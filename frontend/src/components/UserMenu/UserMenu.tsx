import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logoutUserThunk } from "../../store/thunks/authThunks";
import { Avatar, Dropdown, Menu, MenuButton, MenuItem, MenuList } from "@mui/joy";

export default function UserMenu({ id }: { id: string }) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logoutUserThunk());
		navigate("/");
	};

	return (
		<Dropdown>
			<MenuButton variant="plain" sx={{ p: 0, borderRadius: '50%' }}>
				<Avatar
					size="md"
				/>
			</MenuButton>
			<Menu>
				<MenuList sx={{ border: 'none' }}>
					<MenuItem component={Link} to={`/users/${id}`}>
						Ver perfil
					</MenuItem>
					<MenuItem component={Link} to={`/users/${id}/editar`}>
						Editar usuario
					</MenuItem>
					<MenuItem onClick={handleLogout} color="danger">
						Cerrar sesión
					</MenuItem>
				</MenuList>
			</Menu>
		</Dropdown >
	);
};