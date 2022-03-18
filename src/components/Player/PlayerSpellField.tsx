import { Spell } from '@prisma/client';
import { useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';

type PlayerSpellFieldProps = {
    spell: Spell;
    onDelete(id: number): void;
}

export default function PlayerSpellField({ spell, onDelete }: PlayerSpellFieldProps) {
    const logError = useContext(ErrorLogger);

    function deleteSpell() {
        if (!confirm('Tem certeza que deseja apagar essa magia?')) return;
        api.delete('/sheet/player/spell', { data: { id: spell.id } }).then(() => {
            onDelete(spell.id);
        }).catch(logError);
    }

    return (
        <Col xs={6} lg={4} className='data-container m-2 text-center'>
            <Row className='my-2'>
                <Col>
                    <Button variant='secondary' size='sm' onClick={deleteSpell}>Apagar</Button>
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col className='h2'>
                    {spell.name}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col className='h5' style={{ color: 'darkgray' }}>
                    {spell.description}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    Custo: {spell.cost}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    Tipo: {spell.type}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    Dano: {spell.damage}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    Tempo de Conjuração: {spell.castingTime}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    Alcance: {spell.range}
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    Duração: {spell.duration}
                </Col>
            </Row>
        </Col>
    );
}