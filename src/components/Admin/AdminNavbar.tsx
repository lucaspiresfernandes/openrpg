import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import api from '../../utils/api';

export default function AdminNavbar() {
    const router = useRouter();

    function logout() {
        api.delete('/player').then(() => router.replace('/'));
    }

    return (
        <Navbar sticky='top' expand='sm' className='mb-3'>
            <Container fluid>
                <Navbar.Brand>Open RPG</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className='me-auto' navbarScroll>
                        <Link href='/admin/main' passHref><Nav.Link>Painel Geral</Nav.Link></Link>
                        <Link href='/admin/editor' passHref><Nav.Link>Editor</Nav.Link></Link>
                        <Link href='/admin/configurations' passHref><Nav.Link>Configurações</Nav.Link></Link>
                        <Link href='/admin/about' passHref><Nav.Link>Sobre</Nav.Link></Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href='#' onClick={logout}>Sair</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}