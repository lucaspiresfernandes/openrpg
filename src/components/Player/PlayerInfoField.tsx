import Prisma from '@prisma/client';
import { useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import { errorLogger } from '../../pages/sheet/1';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerInfoFieldProps = {
    info: Prisma.Info,
    value: string
}

export default function PlayerInfoField(playerInfo: PlayerInfoFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(playerInfo.value);
    const [isDefined, setDefined] = useState(playerInfo.value.length > 0);

    const logError = useContext(errorLogger);
    const infoID = playerInfo.info.id;

    async function onValueBlur() {
        if (value.length > 0) setDefined(true);
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/info', { id: infoID, value }).catch(logError);
    }

    function renderField() {
        if (isDefined) {
            return <label onDoubleClick={() => setDefined(false)}>{value}</label>;
        }
        return (
            <BottomTextInput autoFocus className='w-100' id={`info${infoID}`} autoComplete='off' value={value}
                onChange={ev => setValue(ev.currentTarget.value)} onBlur={onValueBlur} />
        );
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
                        {renderField()}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}