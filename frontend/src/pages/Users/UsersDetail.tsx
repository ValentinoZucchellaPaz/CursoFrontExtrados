import './Users.css';
import useAxios from '../../hooks/useAxios';
import { APIUserProps } from '../../store/types';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useEffect, useState } from 'react';
import { getUser } from '../../services/userService';


const UsersDetail = ({ }) => {
    const [user, setUser] = useState<APIUserProps | null>(null) // además hacer estado global con usuario en cuestión
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { userId } = useParams()

    useEffect(() => {
        if (userId) {
            setLoading(true)
            getUser(userId)
                .then(res => res.data)
                .then(data => setUser(data))
                .catch(e => setError(e.message))
                .finally(() => setLoading(false))
        }
    }, [])

    // const { data: user, loading, error } = useAxios<APIUserProps>({ url: `http://localhost:5125/info/usuarios/${userId}` })
    console.log(user);

    if (loading) return <p>Cargando...</p>
    if (error) return <p>{error}</p>
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
