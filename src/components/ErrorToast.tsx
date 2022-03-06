import { Toast } from 'react-bootstrap';

type ErrorToastProps = {
    id: number,
    err?: any,
    onClose(ev?: React.MouseEvent | React.KeyboardEvent | undefined): void
}

export default function ErrorToast({ err, onClose }: ErrorToastProps): JSX.Element {
    function getErrorAsMessage(): String {
        const responseData = err.response?.data;
        if (responseData) {
            const message = responseData.message;
            if (message) {
                return `Mensagem do servidor: ${message}`;
            }
        }
        const message = err.message as string;
        return message;
    }

    return (
        <Toast show={true} bg='dark' delay={5000} autohide onClose={onClose}>
            <Toast.Header>
                <span><i className='bi bi-x-circle align-self-center'></i></span>
                <strong className='me-auto ms-1'>Erro</strong>
            </Toast.Header>
            <Toast.Body>{getErrorAsMessage()}</Toast.Body>
        </Toast>
    );
}

export type {
    ErrorToastProps
};