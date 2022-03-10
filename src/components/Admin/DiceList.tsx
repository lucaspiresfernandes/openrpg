import { useEffect, useRef, useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import useSocket from '../../hooks/useSocket';
import { DiceResult, ResolvedDice } from '../../utils';
import DataContainer from '../DataContainer';

type DiceListProps = {
    players: PlayerName[]
}

export type PlayerName = {
    id: number;
    name: string;
}

export default function DiceList(props: DiceListProps) {
    const [values, setValues] = useState<{ name: string, dices: string, results: string }[]>([]);
    const wrapper = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (wrapper.current) wrapper.current.scrollTo({ top: wrapper.current.scrollHeight, behavior: 'auto' });
    }, [values]);

    useSocket(socket => {
        socket.on('dice result', content => {
            const playerID: number = content.playerID;
            const _dices: ResolvedDice[] = content.dices;
            const _results: DiceResult[] = content.results;
            const playerName = props.players.find(p => p.id === playerID)?.name || 'Desconhecido';

            const dices = _dices.map(dice => {
                const num = dice.num;
                const roll = dice.roll;
                return num > 0 ? `${num}d${roll}` : roll;
            });

            const results = _results.map(res => {
                const roll = res.roll;
                const description = res.description;
                if (description) return `${roll} (${description})`;
                return roll;
            });

            const message = {
                name: playerName,
                dices: dices.join(', '),
                results: results.join(', ')
            };

            if (values.length > 6) {
                const newValues = [...values];
                newValues[0] = message;
                setValues(newValues);
                return;
            }

            setValues([...values, message]);
        });
    }, 'admin');

    return (
        <DataContainer xs={12} lg title='Histórico'>
            <Row>
                <Col>
                    <div className='w-100 wrapper' ref={wrapper}>
                        <ListGroup variant='flush' className='text-center'>
                            {values.map((val, index) =>
                                <ListGroup.Item key={index}>
                                    <span style={{ color: 'lightgreen' }}>{val.name}</span>
                                    rolou
                                    <span style={{ color: 'lightgreen' }}>{val.dices}</span>
                                    e tirou
                                    <span style={{ color: 'lightgreen' }}>{val.results}</span>.
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </DataContainer>
    );
}