import { FormEvent, useContext, useState } from 'react';
import { Button, Col, Image, ProgressBar, Row } from 'react-bootstrap';
import useExtendedState from '../../../hooks/useExtendedState';
import { showDiceResult, errorLogger } from '../../../pages/sheet/1';
import { clamp } from '../../../utils';
import api from '../../../utils/api';
import config from '../../../../openrpg.config.json';
import styles from '../../../styles/Attribute.module.scss';
import PlayerAttributeStatusField from './PlayerAttributeStatusField';
import BottomTextInput from '../../BottomTextInput';

type PlayerAttributeFieldProps = {
    playerAttribute: {
        value: number;
        maxValue: number;
        Attribute: {
            id: number;
            name: string;
            rollable: boolean;
        };
    };
    playerStatus: {
        value: boolean;
        AttributeStatus: {
            id: number;
            name: string;
            attribute_id: number;
        };
    }[];
    onStatusChanged?(id: number): void;
}

let valueTimeout: NodeJS.Timeout;

export default function PlayerAttributeField({ playerAttribute, playerStatus, onStatusChanged }: PlayerAttributeFieldProps) {
    const attributeID = playerAttribute.Attribute.id;
    const [value, setValue] = useState(playerAttribute.value);
    const [lastMaxValue, maxValue, setMaxValue] = useExtendedState(playerAttribute.maxValue);

    const showDiceRollResult = useContext(showDiceResult);

    const logError = useContext(errorLogger);
    function updateValue(ev: React.MouseEvent, coeff: number) {
        if (ev.shiftKey) coeff *= 10;

        const newVal = clamp(value + coeff, 0, maxValue);

        if (value === newVal) return;

        setValue(newVal);

        clearTimeout(valueTimeout);
        valueTimeout = setTimeout(() => {
            api.post('/sheet/player/attribute', { attributeID, value: newVal }).catch(logError);
        }, 1500);
    }

    function updateMaxValue(ev: FormEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newMaxValue = parseInt(aux);

        if (aux.length === 0) newMaxValue = 0;
        else if (isNaN(newMaxValue)) return;

        setMaxValue(newMaxValue);
    }

    function maxValueBlur() {
        if (maxValue === lastMaxValue) return;

        setMaxValue(maxValue);
        let valueUpdated = false;
        if (value > maxValue) {
            setValue(maxValue);
            valueUpdated = true;
        };

        api.post('/sheet/player/attribute', { attributeID, maxValue, value: valueUpdated ? maxValue : undefined })
            .catch(err => {
                logError(err);
                setMaxValue(lastMaxValue);
            });
    }

    function diceClick() {
        const roll = config.player.attribute_bar.dice;
        const resolver = `${roll}${config.player.attribute_bar.branched ? 'b' : ''}`;
        showDiceRollResult([{ num: 1, roll: roll, ref: value }], resolver);
    }

    return (
        <Row>
            <Col>
                <Row>
                    <Col><label htmlFor={`attribute${attributeID}`}>
                        Pontos de {playerAttribute.Attribute.name}
                    </label></Col>
                </Row>
                <Row>
                    <Col>
                        <ProgressBar now={value} min={0} max={maxValue} className={playerAttribute.Attribute.name} />
                    </Col>
                    {playerAttribute.Attribute.rollable &&
                        <Col xs='auto' className='align-self-center'>
                            <Image src='/dice20.png' alt='Dado' className={`${styles.dice} clickable`} onClick={diceClick} />
                        </Col>
                    }
                </Row>
                <Row className='justify-content-center mt-2'>
                    <Col xs lg={3}>
                        <Button variant='dark' className='w-100' onClick={ev => updateValue(ev, -1)}>-</Button>
                    </Col>
                    <Col xs lg={2} className='text-center'>
                        <label className='h5' htmlFor={`attribute${attributeID}`}>{`${value}/${maxValue}`}</label>
                    </Col>
                    <Col xs lg={3}>
                        <Button variant='dark' className='w-100' onClick={ev => updateValue(ev, 1)}>+</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 4, offset: 4 }} lg={{ span: 2, offset: 5 }} className='h5' >
                        <BottomTextInput maxLength={3} autoComplete='off' value={maxValue}
                            onChange={updateMaxValue} id={`attribute${attributeID}`}
                            className='text-center w-100' onBlur={maxValueBlur} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {playerStatus.map(stat =>
                            <PlayerAttributeStatusField key={stat.AttributeStatus.id}
                                playerAttributeStatus={stat} onStatusChanged={onStatusChanged} />
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}