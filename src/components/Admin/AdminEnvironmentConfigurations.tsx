import type { ChangeEvent } from 'react';
import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import type { Environment } from '../../utils/config';

export default function AdminEnvironmentConfigurations(props: {
	environment: Environment;
}) {
	const [environment, setEnvironment] = useState(props.environment);
	const logError = useContext(ErrorLogger);

	function environmentChange(ev: ChangeEvent<HTMLInputElement>) {
		const value = ev.target.checked ? 'combat' : 'idle';
		setEnvironment(value);
		api.post('/config', { name: 'environment', value }).catch((err) => {
			setEnvironment(environment);
			logError(err);
		});
	}

	return (
		<Col className='text-center h5'>
			<FormCheck
				inline
				checked={environment === 'combat'}
				onChange={environmentChange}
				id='changeEnvironment'
				label='Retrato em Ambiente de Combate? (Extensão OBS)'
			/>
		</Col>
	);
}
