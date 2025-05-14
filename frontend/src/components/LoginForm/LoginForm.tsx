"use client";
import { useDispatch } from 'react-redux';
import './LoginForm.css';
import { login } from '../../store/slices/userSlice';
import { FormEvent } from 'react';

export default function LoginForm({ }) {

	const dispatch = useDispatch()

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)

		const username = formData.get('username');
		const password = formData.get('password');
		const token = crypto.randomUUID()
		dispatch(login({ username, password, token }))
	}

	return (
		<form className='loginform' onSubmit={handleSubmit}>
			<input type="text" name='username' placeholder='aqui va tu username' />
			<input type="password" name='password' placeholder='ingresa tu contraseña' />
			<button>Login</button>
		</form>
	);
};