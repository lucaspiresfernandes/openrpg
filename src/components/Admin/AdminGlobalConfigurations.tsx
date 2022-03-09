import { useState } from 'react';
import { Form } from 'react-bootstrap';

export default function AdminGlobalConfigurations(props: { environment: string }) {
    const [environment, setEnvironment] = useState(props.environment);

    return (
        <Form.Group>
            <Form.Check inline onChange={() => setEnvironment(environment === 'combat' ? 'idle' : 'combat')}
                checked={environment === 'combat'} id='changeEnvironment' />
            <Form.Label htmlFor='changeEnvironment'>Ambiente de Combate?</Form.Label>
        </Form.Group>
    );
}