import { useContext, useState } from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import FormLabel from 'react-bootstrap/FormLabel';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import { Environment } from '../../utils/config';

export default function AdminEnvironmentConfigurations(props: { environment: Environment }) {
    const [environment, setEnvironment] = useState(props.environment);
    const logError = useContext(ErrorLogger);

    function environmentChange() {
        const value = environment === 'combat' ? 'idle' : 'combat';
        setEnvironment(value);
        api.post('/config', { name: 'environment', value }).catch(err => {
            setEnvironment(environment);
            logError(err);
        });
    }

    return (
        <FormGroup>
            <FormCheck inline onChange={environmentChange}
                checked={environment === 'combat'} id='changeEnvironment' />
            <FormLabel htmlFor='changeEnvironment'>Retrato em Ambiente de Combate? (Extensão OBS)</FormLabel>
        </FormGroup>
    );
}