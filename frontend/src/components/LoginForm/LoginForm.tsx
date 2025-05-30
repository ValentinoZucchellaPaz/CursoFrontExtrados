import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserThunk } from '../../store/thunks/authThunks';
import './LoginForm.css'
import { AxiosError } from 'axios';



export default function Login() {
	const navigate = useNavigate()
	// const [email, setEmail] = useState('');
	// const [contraseña, setContraseña] = useState('');
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false)
	const dispatch = useAppDispatch()


	const validateEmail = (email: string) => {
		const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		return pattern.test(email)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true)

		// if (!validateEmail(email)) {
		// 	setError("Formato email incorrecto\nej. usuario_1@gmail.com")
		// }

		try {
			await dispatch(loginUserThunk({
				email: "admin1@example.com", contraseña: "123456"
			})).unwrap()

			// toast indicando inicio de sesion exitoso
			console.log("exito");

			navigate("/")

		} catch (err: any) {
			console.log(err);

			setError(err?.message);
		} finally {
			setLoading(false)
		}
	};



	return (
		<div className='login-container'>
			<form onSubmit={handleSubmit} className='login-form'>
				<h2>Login</h2>
				{/* <label>Email:
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
				</label> */}
				{error && <p className='error-message'>{error}</p>}

				<button type="submit" disabled={loading}>{loading ? "..." : "Entrar"}</button>

				{/* <p className='login-footer'>¿No tienes una cuenta? <Link to="/sign-up">Crea una</Link></p> */}
			</form>
		</div>
	);
}
