import { Info } from '@prisma/client';
import { useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import { toastsContext } from '../../pages/sheet/1';
import api from '../../utils/api';

type PlayerInfoFieldProps = {
    info: Info,
    value: string
}

export default function PlayerInfoField(playerInfo: PlayerInfoFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(playerInfo.value);

    const addToast = useContext(toastsContext);
    const infoID = playerInfo.info.id;

    async function onValueBlur(ev: React.FormEvent<HTMLInputElement>) {
        const newValue = ev.currentTarget.value;

        if (lastValue === newValue) return;

        setValue(newValue);
        
        try {
            api.post('/sheet/player/info', { infoID, value: newValue });
        }
        catch (err) {
            addToast(err);
        }
    }

    return (
        <Row className='mb-4'>
            <Col className='mx-2'>
                <Row>
                    <Col className='h5'>
                        <label htmlFor={`info${infoID}`}>{playerInfo.info.name}</label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input className='theme-element bottom-text w-100' type='text'
                            id={`info${infoID}`} autoComplete='off' value={value}
                            onChange={ev => setValue(ev.currentTarget.value)}
                            onBlur={onValueBlur} />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}