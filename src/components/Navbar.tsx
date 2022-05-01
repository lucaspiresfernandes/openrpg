import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import api from '../utils/api';

type ApplicationTheme = 'light' | 'dark';

export default function Navbar() {
	const router = useRouter();
	const [theme, setTheme] = useState<ApplicationTheme>('dark');

	useEffect(() => {
		setTheme((localStorage.getItem('application_theme') || 'dark') as ApplicationTheme);
	}, []);

	useEffect(() => {
		switch (theme) {
			case 'light':
				localStorage.setItem('application_theme', 'light');
				document.body.classList.remove('dark');
				document.body.classList.add('light');
				break;
			case 'dark':
				localStorage.setItem('application_theme', 'dark');
				document.body.classList.remove('light');
				document.body.classList.add('dark');
				break;
		}
	}, [theme]);

	if (router.pathname.includes('/portrait')) return null;

	const isActive = (path: string) => router.pathname === path;
	const onPlayerSheet = router.pathname.includes('/sheet/');
	const onAdminPanel = router.pathname.includes('/admin/');

	return (
		<BootstrapNavbar sticky='top' expand='sm' className='mb-3' variant='dark'>
			<Container fluid>
				<BootstrapNavbar.Brand>Open RPG</BootstrapNavbar.Brand>
				<BootstrapNavbar.Toggle />
				<BootstrapNavbar.Collapse>
					<Nav className='me-auto'>
						{onPlayerSheet && (
							<>
								<Link href='/sheet/1' passHref>
									<Nav.Link active={isActive('/sheet/1')}>Página 1</Nav.Link>
								</Link>
								<Link href='/sheet/2' passHref>
									<Nav.Link active={isActive('/sheet/2')}>Página 2</Nav.Link>
								</Link>
							</>
						)}
						{onAdminPanel && (
							<>
								<Link href='/admin/main' passHref>
									<Nav.Link active={isActive('/admin/main')}>Painel</Nav.Link>
								</Link>
								<Link href='/admin/editor' passHref>
									<Nav.Link active={isActive('/admin/editor')}>Editor</Nav.Link>
								</Link>
								<Link href='/admin/configurations' passHref>
									<Nav.Link active={isActive('/admin/configurations')}>
										Configurações
									</Nav.Link>
								</Link>
							</>
						)}
					</Nav>
					<Nav>
						<Nav.Item className='me-3 align-self-center'>
							<FormCheck
								type='switch'
								style={{ marginBottom: 0 }}
								title='Modo Escuro'
								checked={theme === 'dark'}
								onChange={(ev) => setTheme(ev.target.checked ? 'dark' : 'light')}
							/>
						</Nav.Item>
						{(onPlayerSheet || onAdminPanel) && (
							<Nav.Link
								href='#'
								active={false}
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
