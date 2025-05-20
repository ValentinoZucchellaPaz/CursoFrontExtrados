import './Users.css';
import useAxios from '../../hooks/useAxios';
import { APIUserProps } from '../../store/types';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/Card';


const UsersDetail = ({ }) => {

    const { userId } = useParams()

    const { data: user, loading, error } = useAxios<APIUserProps>({ url: `http://localhost:5125/info/usuarios/${userId}` })
    console.log(user);

    if (loading) return <p>Cargando...</p>
    if (error) return <p>{error.message}</p>
    return (
        <div className='user-detail-container'>
            {user ?
                <Card
                    title={user.alias ? `Alias: ${user.alias}` : `Nombre: ${user.name}`}
                    footer={`User ID: ${user.id}`}
                    image={user.avatar}
                >
                    <p>{!user.name && user.name}</p>
                    <p>{user.pais}</p>
                    <p>{user.email && `Email: ${user.email}`}</p>
                    <p>{user.idCreador && `ID creador: ${user.idCreador}`}</p>
                    <p>{user.role && `Rol: ${user.role}`}</p>
                </Card>
                : "Error encontrando el usuario con id" + userId}
        </div>
    );
};

export default UsersDetail;
