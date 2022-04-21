import { useContext } from 'react';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerSpecFieldProps = {
	value: string;
	name: string;
	specId: number;
	onSpecChanged?(name: string, newValue: string): void;
};

export default function PlayerSpecField(playerSpec: PlayerSpecFieldProps) {
	const [lastValue, value, setValue] = useExtendedState(playerSpec.value);

	const logError = useContext(ErrorLogger);
	const specID = playerSpec.specId;

	function onValueBlur() {
		if (lastValue === value) return;
		if (playerSpec.onSpecChanged) playerSpec.onSpecChanged(playerSpec.name, value);
		setValue(value);
		api.post('/sheet/player/spec', { id: specID, value }).catch(logError);
	}

	return (
		<BottomTextInput
			className='w-100 text-center h5'
			onBlur={onValueBlur}
			id={`spec${specID}`}
			autoComplete='off'
			value={value}
			onChange={(ev) => setValue(ev.currentTarget.value)}
		/>
	);
}
