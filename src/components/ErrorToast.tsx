import { Toast } from 'react-bootstrap';
import { MouseEvent, KeyboardEvent } from 'react';

type ErrorToastProps = {
    id: number,
    err?: any,
    onClose(ev?: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element> | undefined): void
}

export default function ErrorToast({ err, onClose }: ErrorToastProps): JSX.Element {
    return (
        <Toast show={true} bg='dark' delay={5000} autohide onClose={onClose}>
            <Toast.Header>
                <span><i className='bi bi-x-circle align-self-center'></i></span>
                <strong className='me-auto ms-1'>Erro de Operação</strong>
                <small className='time'>Agora</small>
            </Toast.Header>
            <Toast.Body>
                {err.message}
            </Toast.Body>
        </Toast>
    );
}

export type {
    ErrorToastProps
};