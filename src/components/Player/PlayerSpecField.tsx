import { useContext } from 'react';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerSpecFieldProps = {
	value: string;
	name: string;
	specId: number;
	npcId?: number;
};

export default function PlayerSpecField(props: PlayerSpecFieldProps) {
	const [value, setValue, isClean] = useExtendedState(props.value);

	const logError = useContext(ErrorLogger);
	const specID = props.specId;

	function onValueBlur() {
		if (isClean()) return;
		api
			.post('/sheet/player/spec', { id: specID, value, npcId: props.npcId })
			.catch(logError);
	}

	return (
		<BottomTextInput
			className='w-100 text-center h5'
			onBlur={onValueBlur}
			name={`spec${props.name}`}
			id={`spec${specID}`}
			autoComplete='off'
			value={value}
			onChange={(ev) => setValue(ev.currentTarget.value)}
		/>
	);
}
