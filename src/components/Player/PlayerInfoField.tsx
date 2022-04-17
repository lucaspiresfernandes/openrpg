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

export default function PlayerInfoField(playerInfo: PlayerInfoFieldProps) {
	const [lastValue, value, setValue] = useExtendedState(playerInfo.value);
	const [isDefined, setDefined] = useState(playerInfo.value.length > 0);
	const inputRef = useRef<HTMLInputElement>(null);
	const firstUpdate = useRef(true);

	const logError = useContext(ErrorLogger);
	const infoID = playerInfo.info.id;

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		if (!isDefined && inputRef.current) inputRef.current.focus();
	}, [isDefined]);

	function onValueBlur() {
		if (value.length > 0) setDefined(true);
		if (lastValue === value) return;
		setValue(value);
		api.post('/sheet/player/info', { id: infoID, value }).catch(logError);
	}

	return (
		<Row className='mb-4'>
			<Col className='mx-2'>
				<Row>
					<label className='h5' htmlFor={`info${infoID}`}>
						{playerInfo.info.name}
					</label>
					{isDefined ? (
						<>
							<br />
							<label onDoubleClick={() => setDefined(false)}>{value}</label>
						</>
					) : (
						<input
							className='theme-element bottom-text'
							id={`info${infoID}`}
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
