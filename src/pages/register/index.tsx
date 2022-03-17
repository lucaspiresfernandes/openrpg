import ApplicationHead from '../../components/ApplicationHead';
import { Button, Col, Container, FormControl, Row } from 'react-bootstrap';
import Link from 'next/link';
import React, { useState } from 'react';
import api from '../../utils/api';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import useToast from '../../hooks/useToast';
import { useRouter } from 'next/router';
import homeStyles from '../../styles/modules/Home.module.scss';
import useAuthentication from '../../hooks/useAuthentication';

export default function Register(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [toasts, addToast] = useToast();
  const router = useRouter();

  useAuthentication(player => {
    if (player) {
      if (player.admin) {
        return router.replace('/sheet/admin/1');
      }
      return router.replace('/sheet/1');
    }
    setLoading(false);
  });

  async function onFormSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);

    if (username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      addToast(new Error('Todos os campos devem ser preenchidos.'));
    }
    else if (password !== confirmPassword) {
      addToast(new Error('As senhas não coincidem.'));
    }
    else {
      try {
        await api.post('/register', { username, password });
        router.replace('/sheet/1');
      }
      catch (err) {
        console.error(err);
        addToast(err);
      }
    }

    setPassword('');
    setConfirmPassword('');
    setLoading(false);
  }

  function form() {
    if (loading) {
      return <></>;
    }

    return (
      <form onSubmit={onFormSubmit}>
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
            <FormControl type='password' className='text-center theme-element' placeholder='Confirmar Senha' id='confirmPassword'
              name='confirmPassword' value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)} />
          </Col>
        </Row>
        <Row className='my-3 justify-content-center'>
          <Col md={6}>
            <Button type='submit' variant='secondary'>
              Cadastrar-se
            </Button>
          </Col>
        </Row>
      </form>
    );
  }

  return (
    <>
      <ApplicationHead />
      <Container className='text-center'>
        <Row>
          <Col>
            <h1><label htmlFor='username'>Cadastro de Jogador</label></h1>
          </Col>
        </Row>
        {form()}
        <Row>
          <Col>
            <Row className='my-3'>
              <Col>
                Já possui cadastro? <Link href='/'><a className={homeStyles.link}>Entrar</a></Link>
              </Col>
            </Row>
            <Row className='my-3'>
              <Col>
                É um administrador? <Link href='/register/admin'><a className={homeStyles.link}>Cadastrar-se como administrador</a></Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <ErrorToastContainer toasts={toasts} />
    </>
  );
}
