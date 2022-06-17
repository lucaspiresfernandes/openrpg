import FormControl from 'react-bootstrap/FormControl';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';

export default function PlayerExtraInfoField(props: {
	npcId?: number;
	extraInfoId: number;
	value: string;
	logError: (err: any) => void;
}) {
	const [value, setValue, isClean] = useExtendedState(props.value);

	function onValueBlur() {
		if (isClean()) return;
		api
			.post('/sheet/player/extrainfo', {
				id: props.extraInfoId,
				value,
				npcId: props.npcId,
			})
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
