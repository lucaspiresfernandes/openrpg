import Router from 'next/router';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import api from '../../utils/api';

export default function WelcomePage() {
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		api
			.post('/init')
			.then(() => Router.reload())
			.catch((err) => setError(err as Error));
	}, []);

	if (error)
		return (
			<Container className='text-center'>
				<Row>
					<Col className='h1 mt-3'>
						Algo de errado aconteceu. O Open RPG não pôde concluir a configuração inicial
						do sistema. Confira se o banco de dados está corretamente vinculado na Heroku
						e faça o redeploy. Caso esse erro persista, contate o(a) administrador(a) do
						Open RPG no{' '}
						<a
							href='https://github.com/alyssapiresfernandescefet/openrpg/issues'
							target='_blank'
							rel='noreferrer'>
							GitHub
						</a>
						.
					</Col>
				</Row>
				<Row>
					<Col className='h4 mt-5'>
						Descrição do erro:
						<br />
						{error.toString()}
					</Col>
				</Row>
			</Container>
		);

	return (
		<Container className='text-center'>
			<Row>
				<Col className='h1 mt-3'>Realizando configuração inicial...</Col>
			</Row>
			<Row>
				<Col className='mt-3'>
					<Spinner animation='border' variant='secondary' />
				</Col>
			</Row>
		</Container>
	);
}
