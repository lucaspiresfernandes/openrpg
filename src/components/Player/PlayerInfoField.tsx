import { Info } from '@prisma/client';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

type PlayerInfoFieldProps = {
    info: Info,
    value: string
}

export default function PlayerInfoField(playerInfo: PlayerInfoFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(playerInfo.value);
    const [isDefined, setDefined] = useState(playerInfo.value.length > 0);
    const fieldRef = useRef<HTMLInputElement>(null);
    const firstUpdate = useRef(true);

    const logError = useContext(ErrorLogger);
    const infoID = playerInfo.info.id;

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!isDefined && fieldRef.current) fieldRef.current.focus();
    }, [isDefined]);

    function onValueBlur() {
        if (value.length > 0) setDefined(true);
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/info', { id: infoID, value }).catch(logError);
    }

    return (
        <Row className='mb-4'>
            <Col className='mx-2'>
                <Row>
                    <Form.Group controlId={`info${infoID}`}>
                        <Form.Label className='h5'>{playerInfo.info.name}</Form.Label>
                        {isDefined ?
                            <>
                                <br />
                                <label onDoubleClick={() => setDefined(false)}>{value}</label>
                            </> :
                            <input className='theme-element bottom-text w-100' id={`info${infoID}`} autoComplete='off' value={value}
                                onChange={ev => setValue(ev.currentTarget.value)} onBlur={onValueBlur} ref={fieldRef} />
                        }
                    </Form.Group>
                </Row>
            </Col>
        </Row>
    );
}