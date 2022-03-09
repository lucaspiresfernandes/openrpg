import { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import { toastsContext } from '../../pages/sheet/2';
import api from '../../utils/api';

export default function PlayerAnnotationsField(props: { value: string }) {
    const [lastValue, value, setValue] = useExtendedState(props.value);
    
    const addToast = useContext(toastsContext);

    async function onValueBlur() {
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/annotation', { value }).catch(addToast);
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