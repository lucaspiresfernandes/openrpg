import ApplicationHead from '../components/ApplicationHead';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import api from '../utils/api';
import ErrorToastContainer from '../components/ErrorToastContainer';
import useToast from '../hooks/useToast';
import styles from '../styles/modules/Home.module.scss';
import Router from 'next/router';
import WelcomePage from '../components/Admin/WelcomePage';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import prisma from '../utils/database';
import { sessionSSR } from '../utils/session';

export default function Home({ init, error }: InferGetServerSidePropsType<typeof getSSP>) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toasts, addToast] = useToast();

  function onFormSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setLoading(true);
    setPassword('');

    if (username.length === 0 || password.length === 0) {
      addToast(new Error('Você deve preencher tanto o usuário como a senha.'));
      setLoading(false);
      return;
    }

    api.post('/login', { username, password }).then(res => {
      if (res.data.admin) return Router.replace('/admin/main');
      Router.replace('/sheet/1');
    }).catch(err => {
      setLoading(false);
      addToast(err);
    });
  }

  if (error) return (
    <Container className='text-center'>
      <Row>
        <Col className='h1 mt-3' style={{ color: 'red' }}>
          O banco de dados não foi inicializado corretamente.
        </Col>
      </Row>
      <Row>
        <Col className='h3 mt-2'>
          Certifique-se de ter integrado um banco de dados ao aplicativo, criado a variável de ambiente <b>DATABASE_URL</b> e preenchido seu valor corretamente.
        </Col>
      </Row>
    </Container>
  );

  if (!init) return (
    <>
      <WelcomePage logError={addToast} />
      <ErrorToastContainer toasts={toasts} />
    </>
  );

  if (loading) return <></>;

  return (
    <>
      <ApplicationHead title='Entrar' />
      <Container className='text-center mt-2'>
        <Row>
          <Col>
            <h1><label htmlFor='username'>Login</label></h1>
          </Col>
        </Row>
        <Form onSubmit={onFormSubmit}>
          <Row className='my-3 justify-content-center'>
            <Col md={6}>
              <Form.Control className='text-center theme-element' placeholder='Login' id='username' name='username'
                value={username} onChange={e => setUsername(e.currentTarget.value)} />
            </Col>
          </Row>
          <Row className='my-3 justify-content-center'>
            <Col md={6}>
              <Form.Control type='password' className='text-center theme-element' placeholder='Senha' id='password' name='password'
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

async function getSSP(ctx: GetServerSidePropsContext) {
  const player = ctx.req.session.player;

  if (player) {
    if (player.admin) {
      return {
        redirect: {
          destination: '/admin/main',
          permanent: false
        },
        props: {
          init: false
        }
      };
    }
    return {
      redirect: {
        destination: '/sheet/1',
        permanent: false
      },
      props: {
        init: false
      }
    };
  }

  try {
    const init = await prisma.config.findUnique({ where: { name: 'init' } });
    return {
      props: {
        init: init === null ? false : true
      }
    };
  }
  catch (err) {
    console.error(err);
    return {
      props: {
        init: false,
        error: true
      }
    };
  }
}

export const getServerSideProps = sessionSSR(getSSP);