import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

export default function useExtendedState<T>(
	initialState: T
): [T, T, Dispatch<SetStateAction<T>>] {
	const [value, setValue] = useState<T>(initialState);
	const [lastValue, setLastValue] = useState<T>(initialState);

	function setValueInternal(newValue: SetStateAction<T>) {
		setLastValue(value);
		setValue(newValue);
	}

	return [lastValue, value, setValueInternal];
}
