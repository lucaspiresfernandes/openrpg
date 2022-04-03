import { Attribute } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, ShowDiceResult } from '../../../contexts';
import { clamp } from '../../../utils';
import api from '../../../utils/api';
import PlayerAttributeStatusField from './PlayerAttributeStatusField';

type PlayerAttributeFieldProps = {
    playerAttribute: {
        value: number;
        maxValue: number;
        Attribute: Attribute;
    };
    playerStatus: {
        value: boolean;
        AttributeStatus: {
            id: number;
            name: string;
            attribute_id: number;
        };
    }[];
    onStatusChanged?(id: number, newValue: boolean): void;
    attributeDice: {
        value: number;
        branched: boolean;
    };
}

export default function PlayerAttributeField(props: PlayerAttributeFieldProps) {
    const attributeID = props.playerAttribute.Attribute.id;
    const [value, setValue] = useState(props.playerAttribute.value);
    const [maxValue, setMaxValue] = useState(props.playerAttribute.maxValue);
    const barRef = useRef<HTMLDivElement>(null);
    const timeout = useRef<NodeJS.Timeout>();

    const showDiceRollResult = useContext(ShowDiceResult);
    const logError = useContext(ErrorLogger);

    useEffect(() => {
        if (barRef.current === null) return;
        const inner = barRef.current.querySelector('.progress-bar') as HTMLDivElement;
        if (inner) inner.style.backgroundColor = `#${props.playerAttribute.Attribute.color}`;
        else console.warn('Could not find .progress-bar inner node inside PlayerAttributeField component.');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barRef]);

    useEffect(() => {
        if (timeout.current) clearTimeout(timeout.current);
    }, [maxValue]);

    function updateValue(ev: React.MouseEvent, coeff: number) {
        if (ev.shiftKey) coeff *= 10;

        const newVal = clamp(value + coeff, 0, maxValue);

        if (value === newVal) return;

        setValue(newVal);

        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() =>
            api.post('/sheet/player/attribute', { id: attributeID, value: newVal }).catch(logError), 750);
    }

    function onNewMaxValue() {
        let input = prompt('Digite o novo valor do atributo:', maxValue.toString());

        if (input === null) return;

        const newMaxValue = parseInt(input);

        if (isNaN(newMaxValue) || maxValue === newMaxValue) return;

        setMaxValue(newMaxValue);
        let valueUpdated = false;
        if (value > newMaxValue) {
            setValue(newMaxValue);
            valueUpdated = true;
        }

        api.post('/sheet/player/attribute', {
            id: attributeID, maxValue: newMaxValue,
            value: valueUpdated ? newMaxValue : undefined
        }).catch(logError);
    }

    function diceClick() {
        const roll = props.attributeDice['value'] as number;
        const branched = props.attributeDice['branched'] as boolean;
        showDiceRollResult([{ num: 1, roll, ref: value }], `${roll}${branched ? 'b' : ''}`);
    }

    return (
        <>
            <Row>
                <Col><label htmlFor={`attribute${attributeID}`}>
                    Pontos de {props.playerAttribute.Attribute.name}
                </label></Col>
            </Row>
            <Row>
                <Col>
                    <ProgressBar now={value} min={0} max={maxValue} ref={barRef} className='clickable' onClick={onNewMaxValue} />
                </Col>
                {props.playerAttribute.Attribute.rollable &&
                    <Col xs='auto' className='align-self-center'>
                        <Image src='/dice20.png' alt='Dado' className='attribute-dice clickable' onClick={diceClick} />
                    </Col>
                }
            </Row>
            <Row className='justify-content-center mt-2'>
                <Col xs lg={3}>
                    <Button variant='secondary' className='w-100' onClick={ev => updateValue(ev, -1)}>-</Button>
                </Col>
                <Col xs lg={2} className='text-center align-self-center h5 m-0'>
                    {`${value}/${maxValue}`}
                </Col>
                <Col xs lg={3}>
                    <Button variant='secondary' className='w-100' onClick={ev => updateValue(ev, 1)}>+</Button>
                </Col>
            </Row>
            <Row className='mt-2 mb-3'>
                <Col>
                    {props.playerStatus.map(stat =>
                        <PlayerAttributeStatusField key={stat.AttributeStatus.id}
                            playerAttributeStatus={stat} onStatusChanged={props.onStatusChanged} />
                    )}
                </Col>
            </Row>
        </>
    );
}