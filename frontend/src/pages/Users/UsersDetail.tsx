import './Users.css';
import { APIUserProps } from '../../store/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useEffect, useState } from 'react';
import { getUser } from '../../services/userService';
import { MdArrowBack } from 'react-icons/md';


const UsersDetail = ({ }) => {
    const [user, setUser] = useState<APIUserProps | null>(null) // además hacer estado global con usuario en cuestión
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const { userId } = useParams()

    // scroll to top cuando renderize
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);


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

    if (loading) return <p>Cargando...</p>
    if (error) return <p>{error}</p>
    return (
        <div className='user-detail-container'>
            <button onClick={() => navigate(-1)}><MdArrowBack color='var(--primary)' /></button>
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
