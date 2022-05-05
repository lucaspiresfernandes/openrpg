import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import styles from '../styles/modules/Home.module.scss';
import ApplicationHead from '../components/ApplicationHead';

export default function notFound() {
	return (
		<>
			<ApplicationHead title='Not Found' />
			<Container className='text-center'>
				<Row className='align-items-center' style={{ height: '90vh' }}>
					<Col>
						<div
							className='d-inline-block px-4 h1'
							style={{ borderRight: '1px solid gray' }}>
							404
						</div>
						<div className='d-inline-block ms-4 h4'>Essa página não foi encontrada.</div>
						<div className='mt-3 h5'>
							<Link href='/'>
								<a className={styles.link}>Voltar para o início</a>
							</Link>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}
