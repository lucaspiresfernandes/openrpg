import { ExtraInfo } from '@prisma/client';
import { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

export default function PlayerExtraInfoField(props: {
	value: string;
	extraInfo: ExtraInfo;
}) {
	const [lastValue, value, setValue] = useExtendedState(props.value);

	const logError = useContext(ErrorLogger);

	function onValueBlur() {
		if (lastValue === value) return;
		setValue(value);
		api
			.post('/sheet/player/extrainfo', { id: props.extraInfo.id, value })
			.catch(logError);
	}

	return (
		<Row className='mb-4'>
			<Col>
				<FormGroup controlId={`extraInfo${props.extraInfo.id}`}>
					<Row>
						<Col className='h4'>
							<FormLabel>{props.extraInfo.name}</FormLabel>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormControl
								as='textarea'
								rows={7}
								value={value}
								onChange={(ev) => setValue(ev.currentTarget.value)}
								onBlur={onValueBlur}
								className='theme-element'
							/>
						</Col>
					</Row>
				</FormGroup>
			</Col>
		</Row>
	);
}
