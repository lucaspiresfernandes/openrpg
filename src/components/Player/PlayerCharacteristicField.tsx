import { Characteristic } from '@prisma/client';
import { ChangeEvent, useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import config from '../../../openrpg.config.json';
import { ErrorLogger, ShowDiceResult } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerCharacteristicFieldProps = {
    value: number;
    modifier: string;
    characteristic: Characteristic;
}

export default function PlayerCharacteristicField(props: PlayerCharacteristicFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(props.value);
    const [lastModifier, modifier, setModifier] = useExtendedState(props.modifier);
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
        if (modifier === lastModifier) return;
        const num = parseInt(modifier);
        let newModifier = modifier;

        if (isNaN(num)) newModifier = '+0';
        else if (num > 9) newModifier = '+9';
        else if (num < -9) newModifier = '-9';
        else if (newModifier === '-0') newModifier = '+0';
        else if (newModifier.length === 1) newModifier = `+${num}`;

        setModifier(newModifier);
        api.post('/sheet/player/characteristic', { modifier: newModifier, id: charID }).catch(logError);
    }

    function rollDice() {
        const base = config.player.base;
        showDiceRollResult([{ num: 1, roll: base.dice, ref: Math.max(1, value + parseInt(modifier)) }],
            `${base.dice}${base.branched ? 'b' : ''}`);
    }

    let modifierValue = modifier;

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
                    <BottomTextInput className='text-center w-100' value={modifierValue}
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