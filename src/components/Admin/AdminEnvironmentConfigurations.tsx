import { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import { Environment } from '../../utils/config';

export default function AdminEnvironmentConfigurations(props: { environment: Environment }) {
    const [environment, setEnvironment] = useState(props.environment);
    const logError = useContext(ErrorLogger);

    function environmentChange() {
        const value = environment === 'combat' ? 'idle' : 'combat';
        setEnvironment(value);
        api.post('/config/environment', { value }).catch(err => {
            setEnvironment(environment);
            logError(err);
        });
    }

    return (
        <Form.Group>
            <Form.Check inline onChange={environmentChange}
                checked={environment === 'combat'} id='changeEnvironment' />
            <Form.Label htmlFor='changeEnvironment'>Ambiente de Combate? (Extensão OBS)</Form.Label>
        </Form.Group>
    );
}