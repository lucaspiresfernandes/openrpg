import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ApplicationHead from '../../components/ApplicationHead';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import useAuthentication from '../../hooks/useAuthentication';
import useToast from '../../hooks/useToast';
import homeStyles from '../../styles/modules/Home.module.scss';
import api from '../../utils/api';

export default function Register() {
	const [loading, setLoading] = useState(true);
	const [toasts, addToast] = useToast();

	useAuthentication((player) => {
		if (player) {
			if (player.admin) return Router.push('/admin/main');
			return Router.push('/sheet/player/1');
		} else setLoading(false);
	});

	async function onFormSubmit(
		username: string,
		password: string,
		confirmPassword: string
	) {
		setLoading(true);

		try {
			if (username.length === 0 || password.length === 0 || confirmPassword.length === 0)
				throw new Error('Todos os campos devem ser preenchidos.');
			if (password !== confirmPassword) throw new Error('As senhas não coincidem.');
			await api.post('/register', { username, password });
			Router.push('/sheet/player/1');
		} catch (err) {
			addToast(err);
			setLoading(false);
		}
	}

	if (loading)
		return (
			<Container className='text-center'>
				<Row className='align-items-center' style={{ height: '90vh' }}>
					<Col>
						<Spinner animation='border' variant='secondary' />
					</Col>
				</Row>
			</Container>
		);

	return (
		<>
			<ApplicationHead title='Cadastro de Jogador' />
			<Container className='text-center mt-2'>
				<Row>
					<Col>
						<h1>
							<label htmlFor='username'>Cadastro de Jogador</label>
						</h1>
					</Col>
				</Row>
				<RegisterForm onSubmit={onFormSubmit} />
				<Row>
					<Col>
						<Row className='my-3'>
							<Col>
								Já possui cadastro?{' '}
								<Link href='/'>
									<a className={homeStyles.link}>Entrar</a>
								</Link>
							</Col>
						</Row>
						<Row className='my-3'>
							<Col>
								É o mestre?{' '}
								<Link href='/register/admin'>
									<a className={homeStyles.link}>Cadastrar-se como mestre</a>
								</Link>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
			<ErrorToastContainer toasts={toasts} />
		</>
	);
}

function RegisterForm(props: {
	onSubmit: (username: string, password: string, confirmPassword: string) => void;
}) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	return (
		<form
			onSubmit={(ev) => {
				ev.preventDefault();
				setPassword('');
				setConfirmPassword('');
				props.onSubmit(username, password, confirmPassword);
			}}>
			<Row className='my-3 justify-content-center'>
				<Col md={6}>
					<FormControl
						className='text-center theme-element'
						placeholder='Login'
						id='username'
						name='username'
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
					/>
				</Col>
			</Row>
			<Row className='my-3 justify-content-center'>
				<Col md={6}>
					<FormControl
						type='password'
						className='text-center theme-element'
						placeholder='Senha'
						id='password'
						name='password'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
				</Col>
			</Row>
			<Row className='my-3 justify-content-center'>
				<Col md={6}>
					<FormControl
						type='password'
						className='text-center theme-element'
						placeholder='Confirmar Senha'
						id='confirmPassword'
						name='confirmPassword'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.currentTarget.value)}
					/>
				</Col>
			</Row>
			<Row className='my-3 justify-content-center'>
				<Col md={6}>
					<Button type='submit' variant='secondary'>
						Cadastrar-se
					</Button>
				</Col>
			</Row>
		</form>
	);
}
