import ApplicationHead from '../components/ApplicationHead';
import { Button, Col, Container, Form, FormControl, Row } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import api from '../utils/api';
import ErrorToastContainer from '../components/ErrorToastContainer';
import useToast from '../hooks/useToast';
import styles from '../styles/modules/Home.module.scss';
import useAuthentication from '../hooks/useAuthentication';
import Router from 'next/router';

export default function Home(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [toasts, addToast] = useToast();

  useAuthentication(player => {
    if (player) {
      if (player.admin) {
        return Router.replace('/sheet/admin/1');
      }
      return Router.replace('/sheet/1');
    }
    setLoading(false);
  });

  async function onFormSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);
    setPassword('');

    if (username.length === 0 || password.length === 0) {
      addToast(new Error('Você deve preencher tanto o usuário como a senha.'));
    }
    else {
      try {
        await api.post('/login', { username, password }).then(res => {
          if (res.data.admin)
            return Router.replace('/sheet/admin/1');
          Router.replace('/sheet/1');
        });
      }
      catch (err) {
        console.error(err);
        addToast(err);
      }
    }

    setLoading(false);
  }

  if (loading) {
    return <></>;
  }

  return (
    <>
      <ApplicationHead title='Entrar' />
      <Container className='text-center'>
        <Row>
          <Col>
            <h1><label htmlFor='username'>Login</label></h1>
          </Col>
        </Row>
        <Form onSubmit={onFormSubmit}>
          <Row className='my-3 justify-content-center'>
            <Col md={6}>
              <FormControl className='text-center theme-element' placeholder='Login' id='username' name='username'
                value={username} onChange={e => setUsername(e.currentTarget.value)} />
            </Col>
          </Row>
          <Row className='my-3 justify-content-center'>
            <Col md={6}>
              <FormControl type='password' className='text-center theme-element' placeholder='Senha' id='password' name='password'
                value={password} onChange={e => setPassword(e.currentTarget.value)} />
            </Col>
          </Row>
          <Row className='my-3 justify-content-center'>
            <Col md={6}>
              <Button type='submit' variant='secondary'>
                Entrar
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col>
            <span className='me-2'>Não possui cadastro?</span>
            <Link href='/register' passHref>
              <a className={styles.link}>Cadastrar-se</a>
            </Link>
          </Col>
        </Row>
      </Container>
      <ErrorToastContainer toasts={toasts} />
    </>
  );
}