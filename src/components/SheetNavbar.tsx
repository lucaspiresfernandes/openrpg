import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import api from '../utils/api';
import config from '../../openrpg.config.json';

export default function SheetNavbar() {
    const router = useRouter();

    function logout() {
        api.delete('/player').then(() => router.replace('/'));
    }

    return (
        <Navbar sticky='top' expand='sm' className='mb-3'>
            <Container fluid>
                <Navbar.Brand>{config.application.name}</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className='me-auto' navbarScroll>
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