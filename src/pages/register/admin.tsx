import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
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
			if (player.admin) {
				return Router.replace('/admin/main');
			}
			return Router.replace('/sheet/1');
		}
		setLoading(false);
	});

	function onFormSubmit(
		username: string,
		password: string,
		confirmPassword: string,
		adminKey: string
	) {
		setLoading(true);

		try {
			if (
				username.length === 0 ||
				password.length === 0 ||
				confirmPassword.length === 0 ||
				adminKey.length === 0
			)
				throw new Error('Todos os campos devem ser preenchidos.');
			else if (password !== confirmPassword) throw new Error('As senhas não coincidem.');
			else
				api
					.post('/register', { username, password, adminKey })
					.then(() => Router.replace('/admin/main'));
		} catch (err) {
			addToast(err);
			setLoading(false);
		}
	}

	return (
		<div>
			<ApplicationHead title='Cadastro de Mestre' />
			<Container className='text-center mt-2'>
				<Row>
					<Col>
						<h1>
							<label htmlFor='username'>Cadastro de Mestre</label>
						</h1>
					</Col>
				</Row>
				{!loading && (
					<>
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
										É um jogador?{' '}
										<Link href='/register'>
											<a className={homeStyles.link}>Cadastrar-se como jogador</a>
										</Link>
									</Col>
								</Row>
							</Col>
						</Row>
					</>
				)}
			</Container>
			<ErrorToastContainer toasts={toasts} />
		</div>
	);
}

function RegisterForm(props: {
	onSubmit(
		username: string,
		password: string,
		confirmPassword: string,
		adminKey: string
	): void;
}) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [adminKey, setAdminKey] = useState('');

	return (
		<form onSubmit={ev => {
			ev.preventDefault();
			setPassword('');
			setConfirmPassword('');
			setAdminKey('');
			props.onSubmit(username, password, confirmPassword, adminKey);
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
					<FormControl
						type='password'
						className='text-center theme-element'
						placeholder='Chave do Mestre'
						id='adminKey'
						name='adminKey'
						value={adminKey}
						onChange={(e) => setAdminKey(e.currentTarget.value)}
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
