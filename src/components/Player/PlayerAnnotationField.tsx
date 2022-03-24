import { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

export default function PlayerAnnotationsField(props: { value?: string }) {
    const [lastValue, value, setValue] = useExtendedState(props.value || '');
    
    const logError = useContext(ErrorLogger);

    async function onValueBlur() {
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/annotation', { value }).catch(logError);
    }

    return (
        <Row className='mb-3'>
            <Col>
                <Form.Control as='textarea' rows={7} id='playerAnnotations' value={value}
                    onChange={ev => setValue(ev.currentTarget.value)} onBlur={onValueBlur}
                    className='theme-element' />
            </Col>
        </Row>
    );
}