import { Characteristic, Prisma } from '@prisma/client';
import { ChangeEvent, useContext, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, ShowDiceResult } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerCharacteristicFieldProps = {
    baseDice: Prisma.JsonObject;
    value: number;
    modifier: string;
    characteristic: Characteristic;
}

export default function PlayerCharacteristicField(props: PlayerCharacteristicFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(props.value);
    const [modifier, setModifier] = useState(props.modifier);
    const lastModifier = useRef(modifier);
    const logError = useContext(ErrorLogger);
    const showDiceRollResult = useContext(ShowDiceResult);

    const charID = props.characteristic.id;

    function onChange(ev: ChangeEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newValue = parseInt(aux);

        if (aux.length === 0) newValue = 0;
        else if (isNaN(newValue)) return;

        setValue(newValue);
    }

    function onValueBlur() {
        if (value === lastValue) return;
        setValue(value);
        api.post('/sheet/player/characteristic', { value, id: charID }).catch(logError);
    }

    function onModifierBlur() {
        const num = parseInt(modifier);

        let newModifier = modifier;
        if (isNaN(num)) newModifier = '+0';
        else if (newModifier === '-0') newModifier = '+0';
        else if (newModifier.length === 1) newModifier = `+${num}`;

        if (modifier !== newModifier) setModifier(newModifier);

        if (newModifier === lastModifier.current) return;
        lastModifier.current = newModifier;
        api.post('/sheet/player/characteristic', { modifier: newModifier, id: charID }).catch(logError);
    }

    function rollDice() {
        const roll = props.baseDice['value'] as number;
        const branched = props.baseDice['branched'] as boolean;
        showDiceRollResult([{ num: 1, roll, ref: Math.max(1, value + parseInt(modifier)) }], `${roll}${branched ? 'b' : ''}`);
    }

    return (
        <Col xs={6} md={4} xl={3} className='my-2'>
            <Row>
                <Col className='mb-2'>
                    <Image fluid alt='Dado' className='clickable' src='/dice20.png'
                        onClick={rollDice} style={{ maxHeight: 50 }} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <label htmlFor={`char${props.characteristic.id}`}>{props.characteristic.name}</label>
                </Col>
            </Row>
            <Row className='justify-content-center mb-2'>
                <Col xs={3}>
                    <BottomTextInput className='text-center w-100' value={modifier}
                        onChange={ev => setModifier(ev.currentTarget.value)} onBlur={onModifierBlur} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BottomTextInput className='h5 w-75 text-center' id={`char${props.characteristic.id}`}
                        value={value} onChange={onChange} onBlur={onValueBlur} maxLength={3} />
                </Col>
            </Row>
        </Col>
    );
}