import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";
import { Form } from "../../components/Form";
import { createUser } from "../../services/userService";
import { mapFormToCreateUser } from "../../utils/mapForm";
import { validateAlias, validateEmail, validateName, validatePassword, validateRole, validateURL } from "../../utils/validations";
import './CreateUser.css'

export default function CreateUser() {
    const navigate = useNavigate()
    const handleSubmit = (data: Record<string, string>) => {
        return createUser(mapFormToCreateUser(data), false).then(() => navigate('/users'));
    }
    return (
        <div className="form-container">
            <Card
                title='Crear usuario'

            >
                <Form
                    fields={[
                        {
                            name: 'nombre',
                            label: 'Nombre',
                            type: 'text',
                            required: true,
                            validate: validateName
                        },
                        {
                            name: 'email',
                            label: 'Email',
                            type: 'email',
                            required: true,
                            validate: validateEmail
                        },
                        {
                            name: 'contraseña',
                            label: 'Contraseña',
                            type: 'password',
                            required: true,
                            validate: validatePassword
                        },
                        {
                            name: 'alias',
                            label: 'Alias',
                            type: 'text',
                            validate: validateAlias
                        },
                        {
                            name: 'avatar',
                            label: 'Avatar (url de imagen)',
                            type: 'url',
                            validate: validateURL
                        },
                        {
                            name: 'role',
                            label: 'Rol',
                            type: 'select',
                            required: true,
                            options: ['admin', 'organizador', 'juez', 'jugador'],
                            validate: validateRole
                        },
                    ]}
                    onSubmit={handleSubmit} />
            </Card>
        </div>
    )
}