import './Users.css';
import { APIUserProps } from '../../store/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useEffect, useState } from 'react';
import { deleteUser, getUser, getUserCollection } from '../../services/userService';
import { MdArrowBack, MdDelete, MdEdit } from 'react-icons/md';
import { TbCards } from 'react-icons/tb'
import {
    Button, Stack, Tooltip,
    Modal, ModalDialog,
    DialogTitle, DialogContent, DialogActions,
    CircularProgress,
} from '@mui/joy';

import { useAppSelector } from '../../store/hooks';
import { deleteValidations } from '../../utils/validations';
import { CollectionAccordion } from '../../components/CollectionAccordion';


const UsersDetail = ({ }) => {
    const [user, setUser] = useState<APIUserProps | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const { userId } = useParams()

    // modals de eliminar y editar usuario
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // obtener datos de usuario
    useEffect(() => {
        if (userId) {
            setLoading(true)
            getUser(userId)
                .then(res => res.data)
                .then(data => setUser(data))
                .catch(e => setError("No se ha encontrado al usuario con id " + userId))
                .finally(() => setLoading(false))
        }
    }, [])


    // validaciones y metodo para eliminar usuario
    const loggedUser = useAppSelector((store) => store.auth)
    const isPlayer = user?.role === 'jugador'
    const canDeleteEdit = user ? deleteValidations(loggedUser, user) : false
    const handleDelete = async () => {
        if (!canDeleteEdit) return; // seguridad extra
        try {
            // await dispatch(deleteUserThunk(viewedUser.id));
            user?.id && await deleteUser(user.id.toLocaleString())
            navigate('/users'); // redirige al listado
        } catch (error: any) {
            console.error("Error al eliminar usuario:", error);
            setError(error.message)
        }
    };


    // scroll to top cuando renderize
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (loading) return <div className="loader-container">
        <CircularProgress thickness={2} variant="plain" />
    </div>
    if (error) return <div className="loader-container">
        <p style={{ textAlign: 'center' }}>{error}</p>
    </div>
    return (
        <div className='user-detail-container'>
            <Button variant='outlined' sx={{
                position: 'absolute',
                top: "10px",
                left: "10px",
            }} onClick={() => navigate(-1)}><MdArrowBack /></Button>
            {user ?
                <Card
                    title={user.name && `Nombre: ${user.name}`}
                    image={user.avatar}
                >
                    <p>{user.alias && `Alias: ${user.alias}`}</p>
                    <p>{user.pais}</p>
                    <p>{user.email && `Email: ${user.email}`}</p>
                    <p>{user.idCreador && `ID creador: ${user.idCreador}`}</p>
                    <p>{user.role && `Rol: ${user.role}`}</p>
                    <p>User ID: {user.id}</p>

                    {/* agregar aca dropdown con cartas de usuario (coleccion) */}
                    {/* <UserColecctionDropdown userId={user.id.toString()} /> */}
                    {(isPlayer && canDeleteEdit) && <CollectionAccordion userId={user.id} />}


                    <Stack direction={'row'} spacing={2} justifyContent={'center'} marginTop={2}>
                        <Tooltip title={!canDeleteEdit ? "No se puede eliminar a este usuario" : "Eliminar usuario"}>
                            <span>
                                <Button
                                    disabled={!canDeleteEdit}
                                    color='danger' variant='outlined'
                                    onClick={() => { canDeleteEdit && setOpenDeleteModal(true) }}>
                                    <MdDelete />
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip title={!canDeleteEdit ? "No se puede editar a este usuario" : "Editar usuario"}>
                            <span>
                                <Button
                                    disabled={!canDeleteEdit}
                                    color='primary'
                                    variant='outlined'
                                    onClick={() => navigate(`/users/${user.id}/editar`)}
                                >
                                    <MdEdit />
                                </Button>
                            </span>
                        </Tooltip>
                        {isPlayer && <Tooltip title="Editar colección de cartas">
                            <Button
                                color='success'
                                variant='outlined'
                                onClick={() => { navigate(`/users/${userId}/coleccion`) }}
                            >
                                <TbCards />
                            </Button>
                        </Tooltip>}
                    </Stack>
                </Card>
                : "Error encontrando el usuario con id" + userId}

            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <ModalDialog variant="outlined" role="alertdialog"
                    sx={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogContent>
                        Esta acción eliminará permanentemente al usuario <strong>{user?.alias}</strong>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="plain" onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
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

        </div >
    );
};

export default UsersDetail;
