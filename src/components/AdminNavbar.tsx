import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Navbar, Nav } from 'react-bootstrap';
import api from '../utils/api';

export default function AdminNavbar() {
    const router = useRouter();

    function logout() {
        api.delete('/player').then(() => router.replace('/'));
    }

    return (
        <Navbar bg='info' sticky='top' expand='sm' className='mb-3'>
            <Container fluid>
                <Navbar.Brand>Open RPG</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className='me-auto' navbarScroll>
                        <Link href='/sheet/admin/1' passHref><Nav.Link>Painel Geral</Nav.Link></Link>
                        <Link href='/sheet/admin/2' passHref><Nav.Link>Editor</Nav.Link></Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href='#' onClick={logout}>Sair</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}