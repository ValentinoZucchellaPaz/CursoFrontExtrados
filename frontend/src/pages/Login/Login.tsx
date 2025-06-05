import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useAppDispatch } from '../../store/hooks';
import { loginUserThunk } from '../../store/thunks/authThunks';
import './Login.css';
import { Form } from '../../components/Form';

const Login = ({ }) => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleSubmit = async () => {
		return dispatch(loginUserThunk({
			email: "admin1@example.com", contraseña: "123456"
		})).unwrap().then(() => navigate('/'))
	};

	return (
		<div className='login'>
			<Card title='Login'>
				<Form
					fields={[]}
					onSubmit={handleSubmit}
					submitLabel='Entrar'
				/>
			</Card>
		</div>
	);
};

export default Login;