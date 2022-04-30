import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import api from '../utils/api';

export default function Navbar() {
	const router = useRouter();

	const onPlayerSheet = router.pathname.includes('/sheet');
	const onAdminPanel = router.pathname.includes('/admin');

	return (
		<BootstrapNavbar sticky='top' expand='sm' className='mb-3' variant='dark'>
			<Container fluid>
				<BootstrapNavbar.Brand>Open RPG</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle />
				<BootstrapNavbar.Collapse>
					<Nav className='me-auto' navbarScroll>
						{onPlayerSheet && (
							<>
								<Link href='/sheet/1' passHref>
									<Nav.Link>Página 1</Nav.Link>
								</Link>
								<Link href='/sheet/2' passHref>
									<Nav.Link>Página 2</Nav.Link>
								</Link>
							</>
						)}
						{onAdminPanel && (
							<>
								<Link href='/admin/main' passHref>
									<Nav.Link>Painel</Nav.Link>
								</Link>
								<Link href='/admin/editor' passHref>
									<Nav.Link>Editor</Nav.Link>
								</Link>
								<Link href='/admin/configurations' passHref>
									<Nav.Link>Configurações</Nav.Link>
								</Link>
							</>
						)}
					</Nav>
					<Nav>
						{(onPlayerSheet || onAdminPanel) && (
							<Nav.Link
								href='#'
								onClick={() => api.delete('/player').then(() => router.replace('/'))}>
								Sair
							</Nav.Link>
						)}
					</Nav>
				</BootstrapNavbar.Collapse>
			</Container>
		</BootstrapNavbar>
	);
}
