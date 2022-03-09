import { useRef, useState } from 'react';

export default function useExtendedState<T>(initialState: T): [T, T, (newValue: T) => void] {
    const [value, setValue] = useState<T>(initialState);
    
    const lastValue = useRef(value);

    function setValueInternal(newValue: T) {
        lastValue.current = value;
        setValue(newValue);
    }

    return [lastValue.current, value, setValueInternal];
}