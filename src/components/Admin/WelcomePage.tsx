import Router from 'next/router';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import api from '../../utils/api';

export default function WelcomePage({ logError }: { logError: (err: any) => void }) {
    const [loading, setLoading] = useState(false);

    function init() {
        setLoading(true);
        api.post('/init').then(() => {
            Router.reload();
        }).catch(err => {
            logError(err);
            setLoading(false);
        });
    }

    if (loading) return (
        <Container className='text-center'>
            <Row>
                <Col className='mt-3'>
                    <Image src='/loading.svg' alt='Loading...' fluid />
                </Col>
            </Row>
        </Container>
    );

    return (
        <Container className='text-center'>
            <Row>
                <Col className='h1 mt-3'>
                    Seja bem-vindo ao Open RPG!
                </Col>
            </Row>
            <Row>
                <Col className='h3 mt-3'>
                    Antes de começar, você precisa inicializar o sistema.
                </Col>
            </Row>
            <Row>
                <Col className='mt-3'>
                    <Button variant='secondary' size='lg' onClick={init}>Inicializar</Button>
                </Col>
            </Row>
        </Container>

    );
}