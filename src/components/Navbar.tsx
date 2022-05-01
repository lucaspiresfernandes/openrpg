import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import { ThemeManager } from '../contexts/theme';
import api from '../utils/api';

export default function Navbar() {
	const router = useRouter();
	const themeManager = useContext(ThemeManager);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setDarkMode(themeManager.currentTheme === 'dark');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function isActive(path: string) {
		return router.pathname === path;
	}

	if (router.pathname.includes('/portrait')) return null;

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
								checked={darkMode}
								onChange={(ev) => {
									const dark = ev.target.checked;
									setDarkMode(dark);
									themeManager.changeTheme(dark ? 'dark' : 'light');
								}}
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
