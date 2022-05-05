import FormControl from 'react-bootstrap/FormControl';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

export default function PlayerExtraInfoField(props: {
	extraInfoId: number;
	value: string;
	logError: (err: any) => void;
}) {
	const [lastValue, value, setValue] = useExtendedState(props.value);

	function onValueBlur() {
		if (lastValue === value) return;
		setValue(value);
		api
			.post('/sheet/player/extrainfo', { id: props.extraInfoId, value })
			.catch(props.logError);
	}

	return (
		<FormControl
			as='textarea'
			rows={7}
			value={value}
			onChange={(ev) => setValue(ev.currentTarget.value)}
			onBlur={onValueBlur}
			className='theme-element'
		/>
	);
}
