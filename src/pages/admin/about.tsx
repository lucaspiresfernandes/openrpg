import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ApplicationHead from '../../components/ApplicationHead';
import AdminNavbar from '../../components/Admin/AdminNavbar';

export default function About() {
    return (
        <>
            <ApplicationHead title='Sobre' />
            <AdminNavbar />
            <Container className='text-center'>
                <Row className='display-5'>
                    <Col>Sobre o Aplicativo</Col>
                </Row>
                <Row>
                    <Col className='h5 mt-3'>
                        <p>
                            Open RPG é um projeto que visa auxiliar mestres de RPG a gerenciar as
                            fichas dos personagens de sua campanha e agilizar processos comuns.
                        </p>
                    </Col>
                </Row>
                <Row className='display-5'>
                    <Col>Regras Gerais</Col>
                </Row>
                <Row>
                    <Col className='h5 mt-3'>
                        <p>
                            - A Informação Pessoal (Geral) &quot;Nome&quot; é obrigatória e não pode ser excluída ou modificada.
                            Ela serve como um dado essencial para o funcionamento saudável do aplicativo.
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    );
}