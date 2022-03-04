import { useState } from 'react';
import { ErrorToastProps } from '../components/ErrorToast';

let id = 0;

type AddToastFunction = {
    (err: any): void
};

export default function useToast(): [ErrorToastProps[], AddToastFunction] {
    const [toasts, setToasts] = useState<ErrorToastProps[]>([]);

    function addToast(err: any) {
        let newId = id++;
        setToasts(toasts => [...toasts, { id: newId, err, onClose: () => removeToast(newId) }]);
    }

    function removeToast(id: number) {
        setToasts((toasts) => toasts.filter((e) => e.id !== id));
    }

    return [toasts, addToast];
}