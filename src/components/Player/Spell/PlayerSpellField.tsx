import { Spell } from '@prisma/client';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';

type PlayerSpellFieldProps = {
    spell: Spell;
    onDelete(id: number): void;
}

export default function PlayerSpellField({ spell, onDelete }: PlayerSpellFieldProps) {
    const logError = useContext(ErrorLogger);
    const [loading, setLoading] = useState(false);

    function deleteSpell() {
        if (!confirm('Tem certeza que deseja apagar essa magia?')) return;
        setLoading(true);
        api.delete('/sheet/player/spell', { data: { id: spell.id } }).then(() => {
            onDelete(spell.id);
        }).catch(logError).finally(() => setLoading(false));
    }

    return (
        <Col xs={12} className='mb-3 w-100 text-center'>
            <Row>
                <Col className='data-container mx-3'>
                    <Row className='my-2'>
                        <Col>
                            <Button variant='secondary' size='sm' onClick={deleteSpell} disabled={loading}>
                                Apagar
                            </Button>
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
                            Alvo: {spell.target}
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
                    <Row className='mb-2'>
                        <Col>
                            Espaços Utilizados: {spell.slots}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}