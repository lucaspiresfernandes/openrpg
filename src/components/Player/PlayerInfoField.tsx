import { Info } from '@prisma/client';
import { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerInfoFieldProps = {
    info: Info,
    value: string
}

export default function PlayerInfoField(playerInfo: PlayerInfoFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(playerInfo.value);
    const [isDefined, setDefined] = useState(playerInfo.value.length > 0);

    const logError = useContext(ErrorLogger);
    const infoID = playerInfo.info.id;

    function onValueBlur() {
        if (value.length > 0) setDefined(true);
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/info', { id: infoID, value }).catch(logError);
    }

    function Field() {
        if (isDefined) return (
            <>
                <br />
                <label onDoubleClick={() => setDefined(false)}>{value}</label>
            </>
        );

        return (
            <BottomTextInput className='w-100' id={`info${infoID}`} autoComplete='off' value={value}
                onChange={ev => setValue(ev.currentTarget.value)} onBlur={onValueBlur} />
        );
    }

    return (
        <Row className='mb-4'>
            <Col className='mx-2'>
                <Row>
                    <Form.Group controlId={`info${infoID}`}>
                        <Form.Label className='h5'>{playerInfo.info.name}</Form.Label>
                        <Field />
                    </Form.Group>
                </Row>
            </Col>
        </Row>
    );
}