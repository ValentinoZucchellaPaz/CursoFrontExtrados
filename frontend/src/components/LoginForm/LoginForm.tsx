"use client"
import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/thunks/authThunks';



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

			setError('Error inesperado');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Login</h2>
			<label>Email: <input value={email} onChange={e => setEmail(e.target.value)} /></label>
			<label>Contraseña: <input type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} /></label>
			<button type="submit">Entrar</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</form>
	);
}
