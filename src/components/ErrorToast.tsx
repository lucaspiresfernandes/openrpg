import Toast from 'react-bootstrap/Toast';

type ErrorToastProps = {
	id: number;
	err?: any;
	onClose: (ev?: React.MouseEvent | React.KeyboardEvent | undefined) => void;
};

export default function ErrorToast({ err, onClose }: ErrorToastProps) {
	let message = err.message;
	const responseData = err.response?.data;
	if (responseData) {
		const responseMessage = responseData.message;
		if (responseMessage) message = `Mensagem do servidor: ${responseMessage}`;
	}

	return (
		<Toast show={true} bg='dark' delay={10000} autohide onClose={onClose}>
			<Toast.Header>
				<span>
					<i className='bi bi-x-circle align-self-center'></i>
				</span>
				<strong className='me-auto ms-1'>Erro</strong>
			</Toast.Header>
			<Toast.Body>{message}</Toast.Body>
		</Toast>
	);
}

export type { ErrorToastProps };
