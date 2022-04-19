import { Info } from '@prisma/client';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

type PlayerInfoFieldProps = {
	info: Info;
	value: string;
};

export default function PlayerInfoField(props: PlayerInfoFieldProps) {
	const [lastValue, value, setValue] = useExtendedState(props.value);
	const [isDefined, setDefined] = useState(props.value.length > 0);
	const inputRef = useRef<HTMLInputElement>(null);
	const componentDidMount = useRef(false);

	const logError = useContext(ErrorLogger);

	useEffect(() => {
		if (componentDidMount.current) {
			if (!isDefined && inputRef.current) inputRef.current.focus();
			return;
		}
		componentDidMount.current = true;
	}, [isDefined]);

	function onValueBlur() {
		if (value.length > 0) setDefined(true);
		if (lastValue === value) return;
		setValue(value);
		api.post('/sheet/player/info', { id: props.info.id, value }).catch(logError);
	}

	return (
		<Row className='mb-4'>
			<Col className='mx-2'>
				<Row>
					<label className='h5' htmlFor={`info${props.info.id}`}>
						{props.info.name}
					</label>
					{isDefined ? (
						<label onDoubleClick={() => setDefined(false)}>{value}</label>
					) : (
						<input
							className='theme-element bottom-text'
							id={`info${props.info.id}`}
							autoComplete='off'
							value={value}
							onChange={(ev) => setValue(ev.currentTarget.value)}
							onBlur={onValueBlur}
							ref={inputRef}
						/>
					)}
				</Row>
			</Col>
		</Row>
	);
}
