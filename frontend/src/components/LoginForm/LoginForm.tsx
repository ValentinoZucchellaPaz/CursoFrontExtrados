import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/thunks/authThunks';
import './LoginForm.css'
import { AxiosError } from 'axios';



export default function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('');
	const [contraseña, setContraseña] = useState('');
	const [error, setError] = useState('');
	const dispatch = useAppDispatch()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');


		try {
			await dispatch(loginUser({
				email, contraseña
			})).unwrap()

			// toast indicando inicio de sesion exitoso
			console.log("exito");

			navigate("/")

		} catch (err: any) {
			console.log(err);

			setError(err?.message);
		}
	};

	return (
		<div className='login-container'>
			<form onSubmit={handleSubmit} className='login-form'>
				<h2>Login</h2>
				<label>Email:
					<input
						type='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</label>
				<label>
					Contraseña:
					<input
						type="password"
						value={contraseña}
						onChange={e => setContraseña(e.target.value)}
						required
					/>
				</label>
				{error && <p className='error-message'>{error}</p>}
				<button type="submit">Entrar</button>
			</form>
		</div>
	);
}
