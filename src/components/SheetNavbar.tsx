import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Navbar, Nav } from 'react-bootstrap';
import api from '../utils/api';

export default function SheetNavbar() {
    const router = useRouter();

    function logout() {
        api.delete('/player').then(() => router.replace('/'));
    }

    return (
        <Navbar bg='info' sticky='top'>
            <Container fluid>
                <Navbar.Brand>Open RPG</Navbar.Brand>
                <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Link href='/sheet/1' passHref><Nav.Link>Página 1</Nav.Link></Link>
                        <Link href='/sheet/2' passHref><Nav.Link>Página 2</Nav.Link></Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href='#' onClick={logout}>Sair</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}