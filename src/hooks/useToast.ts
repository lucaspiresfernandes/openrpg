import { useState } from 'react';
import type { ErrorToastProps } from '../components/ErrorToast';

export default function useToast(): [ErrorToastProps[], (err: any) => void] {
	const [toasts, setToasts] = useState<ErrorToastProps[]>([]);

	function addToast(err: any) {
		const id = Date.now();
		setToasts((toasts) => [...toasts, { id, err, onClose: () => removeToast(id) }]);
	}

	function removeToast(id: number) {
		setToasts((toasts) => toasts.filter((e) => e.id !== id));
	}

	return [toasts, addToast];
}
