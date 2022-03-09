import { ExtraInfo } from '@prisma/client';
import { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import { errorLogger } from '../../pages/sheet/2';
import api from '../../utils/api';

export default function PlayerExtraInfoField(props: { value: string, extraInfo: ExtraInfo }) {
    const [lastValue, value, setValue] = useExtendedState(props.value);

    const logError = useContext(errorLogger);

    async function onValueBlur() {
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/extrainfo', { id: props.extraInfo.id, value }).catch(logError);
    }

    return (
        <Row className='mb-4'>
            <Col>
                <Row>
                    <Col className='h4'>
                        <label htmlFor={`extraInfo${props.extraInfo.id}`}>{props.extraInfo.name}</label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Control as='textarea' rows={7} id={`extraInfo${props.extraInfo.id}`} value={value}
                            onChange={ev => setValue(ev.currentTarget.value)} onBlur={onValueBlur} className='theme-element' />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}