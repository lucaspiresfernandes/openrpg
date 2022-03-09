import { Config } from '@prisma/client';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

export default function AdminGlobalConfigurations(props: { environment: Config | null }) {
    const [environment, setEnvironment] = useState(props.environment?.value || 'idle');

    return (
        <Form.Group>
            <Form.Check inline onChange={() => setEnvironment(environment === 'combat' ? 'idle' : 'combat')}
                checked={environment === 'combat'} id='changeEnvironment' />
            <Form.Label htmlFor='changeEnvironment'>Ambiente de Combate?</Form.Label>
        </Form.Group>
    );
}