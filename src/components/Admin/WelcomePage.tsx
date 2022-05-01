import Router from 'next/router';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';
import ErrorToastContainer from '../ErrorToastContainer';

export default function WelcomePage() {
	const [loading, setLoading] = useState(false);
	const [toasts, addToast] = useToast();

	function init() {
		setLoading(true);
		api
			.post('/init')
			.then(() => {
				Router.reload();
			})
			.catch((err) => {
				setLoading(false);
				addToast(err);
			});
	}

	if (loading)
		return (
			<>
				<Container className='text-center'>
					<Row>
						<Col className='mt-3'>
							<Spinner animation='border' variant='secondary' />
						</Col>
					</Row>
				</Container>
				<ErrorToastContainer toasts={toasts} />
			</>
		);

	return (
		<>
			<Container className='text-center'>
				<Row>
					<Col className='h1 mt-3'>Seja bem-vindo ao Open RPG!</Col>
				</Row>
				<Row>
					<Col className='h3 mt-3'>
						Antes de começar, você precisa realizar a configuração inicial do sistema.
					</Col>
				</Row>
				<Row>
					<Col className='mt-3'>
						<Button variant='secondary' size='lg' onClick={init}>
							Configurar
						</Button>
					</Col>
				</Row>
			</Container>
			<ErrorToastContainer toasts={toasts} />
		</>
	);
}
