import { Card } from "../../components/Card";
import { Form } from "../../components/Form";
import { createUser } from "../../services/userService";
import { mapFormToCreateUser } from "../../utils/mapForm";
import { validateEmail } from "../../utils/validations";
import './CreateUser.css'

export default function CreateUser() {

    const handleSubmit = (data: Record<string, string>) => {
        return createUser(mapFormToCreateUser(data), false);
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
                        },
                        {
                            name: 'alias',
                            label: 'Alias',
                            type: 'text',
                        },
                        {
                            name: 'avatar',
                            label: 'Avatar (url de imagen)',
                            type: 'url'
                        },
                        {
                            name: 'role',
                            label: 'Rol',
                            type: 'select',
                            required: true,
                            options: ['admin', 'organizador', 'juez', 'jugador']
                        },
                    ]}
                    onSubmit={handleSubmit} />
            </Card>
        </div>
    )
}