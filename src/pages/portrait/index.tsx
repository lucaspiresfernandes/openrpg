import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import prisma from '../../utils/database';

export default function PortraitSelection(props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
    return (
        <Container className='text-center'>
            <Row className='my-3'>
                <Col className='h3'>
                    Selecione o retrato que deseja acessar:
                </Col>
            </Row>
            {props.players.map(player =>
                <Row className='my-2' key={player.id}>
                    <Col className='h5'>
                        <Link href={`/portrait/${player.id}`}>
                            <a>
                                {player.PlayerInfo[0].value || 'Desconhecido'} ({player.id})
                            </a>
                        </Link>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const players = await prisma.player.findMany({
        where: { role: 'PLAYER' },
        select: {
            id: true, PlayerInfo: {
                where: { Info: { name: 'Nome' } },
                select: { value: true }
            }
        }
    });

    return {
        props: {
            players
        }
    };
}