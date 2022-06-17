import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import api from '../utils/api';

export default function Navbar() {
	const router = useRouter();

	if (router.pathname.includes('/portrait')) return null;

	const isActive = (path: string) => router.pathname === path;
	const onPlayerSheet = router.pathname.includes('/sheet/player/');
	const onNpcSheet = router.pathname.includes('/sheet/npc/');
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
								<Link href='/sheet/player/1' passHref>
									<Nav.Link active={isActive('/sheet/player/1')}>Página 1</Nav.Link>
								</Link>
								<Link href='/sheet/player/2' passHref>
									<Nav.Link active={isActive('/sheet/player/2')}>Página 2</Nav.Link>
								</Link>
							</>
						)}
						{onNpcSheet && (
							<>
								<Link href={`/sheet/npc/${router.query.id}/1`} passHref>
									<Nav.Link active={isActive('/sheet/npc/[id]/1')}>Página 1</Nav.Link>
								</Link>
								<Link href={`/sheet/npc/${router.query.id}/2`} passHref>
									<Nav.Link active={isActive('/sheet/npc/[id]/2')}>Página 2</Nav.Link>
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
							<ThemeManager />
						</Nav.Item>
						{(onPlayerSheet || onAdminPanel) && (
							<Nav.Link
								href='#'
								active={false}
								onClick={() => api.delete('/player').then(() => router.push('/'))}>
								Sair
							</Nav.Link>
						)}
					</Nav>
				</BootstrapNavbar.Collapse>
			</Container>
		</BootstrapNavbar>
	);
}

function ThemeManager() {
	const [darkMode, setDarkMode] = useState(true);

	useEffect(() => {
		const theme = localStorage.getItem('application_theme');
		setDarkMode(theme ? theme === 'dark' : true);
	}, []);

	useEffect(() => {
		if (darkMode) {
			localStorage.setItem('application_theme', 'dark');
			document.body.classList.remove('light');
			document.body.classList.add('dark');
			return;
		}
		localStorage.setItem('application_theme', 'light');
		document.body.classList.remove('dark');
		document.body.classList.add('light');
	}, [darkMode]);

	return (
		<FormCheck
			type='switch'
			title='Modo Escuro'
			aria-label='Tema'
			checked={darkMode}
			onChange={(ev) => setDarkMode(ev.target.checked)}
		/>
	);
}
