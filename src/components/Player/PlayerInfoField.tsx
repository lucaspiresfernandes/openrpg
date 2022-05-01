import { useContext, useEffect, useRef, useState } from 'react';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

type PlayerInfoFieldProps = {
	infoId: number;
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
		api.post('/sheet/player/info', { id: props.infoId, value }).catch(logError);
	}

	if (isDefined) return <label onDoubleClick={() => setDefined(false)}>{value}</label>;

	return (
		<input
			className='theme-element bottom-text'
			id={`info${props.infoId}`}
			autoComplete='off'
			value={value}
			onChange={(ev) => setValue(ev.currentTarget.value)}
			onBlur={onValueBlur}
			ref={inputRef}
		/>
	);
}
