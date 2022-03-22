import { useRef, useState } from 'react';

export default function useExtendedState<T>(initialState: T): [T, T, (newValue: T) => void] {
    const [value, setValue] = useState<T>(initialState);
    const [lastValue, setLastValue] = useState<T>(initialState);

    function setValueInternal(newValue: T) {
        setLastValue(value);
        setValue(newValue);
    }

    return [lastValue, value, setValueInternal];
}