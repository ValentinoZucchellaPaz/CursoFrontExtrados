"use client"
import { useState } from 'react';
import { loginSuccess } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { request } from '../../services/request';
import { useNavigate } from 'react-router-dom';

interface APILoginResponse {
	accessToken: string
	userId: number
	userEmail: string
	userRole: string
}

export default function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('');
	const [contraseña, setContraseña] = useState('');
	const [error, setError] = useState('');

	const dispatch = useAppDispatch();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const res = await request<APILoginResponse>({
				url: 'http://localhost:5125/usuario/login',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: { email, contraseña }
			});

			// const data = await res.json(); // { token, role }
			console.log("exito");
			console.log(res);

			dispatch(loginSuccess({
				token: res.accessToken,
				role: res.userRole,
				userId: res.userId.toLocaleString(),
				userMail: res.userEmail
			}));

			// toast indicando inicio de sesion exitoso

			navigate("/")

		} catch (err: any) {
			console.log(err);

			setError(err.response.data.Detail || err.response.data.title || 'Error inesperado');
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
