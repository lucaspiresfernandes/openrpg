import Prisma from '@prisma/client';
import { ChangeEvent, useContext } from 'react';
import { Col, Form, Image, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import config from '../../../openrpg.config.json';
import BottomTextInput from '../BottomTextInput';
import { ErrorLogger, ShowDiceResult } from '../../contexts';

type PlayerCharacteristicFieldProps = {
    value: number;
    characteristic: Prisma.Characteristic;
}

export default function PlayerCharacteristicField({ value: initialValue, characteristic }: PlayerCharacteristicFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(initialValue);
    const logError = useContext(ErrorLogger);
    const showDiceRollResult = useContext(ShowDiceResult);

    const charID = characteristic.id;

    function onChange(ev: ChangeEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newValue = parseInt(aux);

        if (aux.length === 0) newValue = 0;
        else if (isNaN(newValue)) return;

        setValue(newValue);
    }

    function onBlur() {
        if (value === lastValue) return;
        setValue(value);
        api.post('/sheet/player/characteristic', { value, id: charID }).catch(err => {
            logError(err);
            setValue(lastValue);
        });
    }

    function rollDice() {
        const base = config.player.base;
        showDiceRollResult([{ num: 1, roll: base.dice, ref: value }], `${base.dice}${base.branched ? 'b' : ''}`);
    }

    return (
        <Col xs={6} md={4} xl={3} className='my-2'>
            {characteristic.rollable &&
                <Row>
                    <Col className='mb-2'>
                        <Image fluid alt='Dado' className='clickable' src='/dice20.png'
                            onClick={rollDice} style={{ maxHeight: 50 }} />
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <Form.Group controlId={`char${characteristic.id}`}>
                        <Form.Label className='w-100'>{characteristic.name}</Form.Label>
                        <BottomTextInput className='h5 w-75 text-center' id={`char${characteristic.id}`}
                            value={value} onChange={onChange} onBlur={onBlur} maxLength={3} />
                    </Form.Group>
                </Col>
            </Row>
        </Col>
    );
}