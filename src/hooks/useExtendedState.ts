import { useState, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export default function useExtendedState<T>(
	initialState: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => boolean] {
	const [value, setValue] = useState<T>(initialState);
	const lastValue = useRef<T>(
		initialState instanceof Function ? initialState() : initialState
	);

	const isClean = () => {
		const clean = value === lastValue.current;
		if (!clean) lastValue.current = value;
		return clean;
	};

	return [value, setValue, isClean];
}
