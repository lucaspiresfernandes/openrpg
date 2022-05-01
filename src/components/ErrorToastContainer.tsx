import ToastContainer from 'react-bootstrap/ToastContainer';
import type { ErrorToastProps } from './ErrorToast';
import ErrorToast from './ErrorToast';

type ErrorToastContainerProps = {
	toasts: ErrorToastProps[];
};

export default function ErrorToastContainer({ toasts }: ErrorToastContainerProps) {
	return (
		<ToastContainer position='bottom-end' className='p-3 position-fixed'>
			{toasts.map((toast) => (
				<ErrorToast
					key={toast.id}
					id={toast.id}
					err={toast.err}
					onClose={toast.onClose}
				/>
			))}
		</ToastContainer>
	);
}
