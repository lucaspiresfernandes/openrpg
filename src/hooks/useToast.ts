import { useState } from 'react';
import { ErrorToastProps } from '../components/ErrorToast';

export type AddToastFunction = {
    (err: any): void
};

export default function useToast(): [ErrorToastProps[], AddToastFunction] {
    const [toasts, setToasts] = useState<ErrorToastProps[]>([]);

    function addToast(err: any) {
        const id = Date.now();
        setToasts(toasts => [...toasts, { id, err, onClose: () => removeToast(id) }]);
    }

    function removeToast(id: number) {
        setToasts((toasts) => toasts.filter((e) => e.id !== id));
    }

    return [toasts, addToast];
}