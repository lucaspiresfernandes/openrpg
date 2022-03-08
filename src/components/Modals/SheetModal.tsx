import { MouseEvent, MouseEventHandler } from 'react';
import { Button, Modal, ModalProps } from 'react-bootstrap';

interface SheetModalProps extends ModalProps {
    title: string;
    children?: JSX.Element;
    applyButton?: { name: string, onApply(ev: MouseEvent | undefined): MouseEventHandler | void };
}

export default function SheetModal(props: SheetModalProps) {
    function apply(ev: MouseEvent) {
        if (props.onHide) props.onHide();
        props.applyButton?.onApply(ev);
    }
    return (
        <Modal animation={props.animation} autoFocus={props.autoFocus} backdrop={props.backdrop} centered={props.centered}
            fullscreen={props.fullscreen} keyboard={props.keyboard} onEnter={props.onEnter} onEntered={props.onEntered}
            onEntering={props.onEntering} onEscapeKeyDown={props.onEscapeKeyDown} onExit={props.onExit} onExited={props.onExited}
            onExiting={props.onExiting} onHide={props.onHide} onShow={props.onShow} scrollable={props.scrollable} show={props.show}
            size={props.size}>
            <Modal.Header>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                {props.applyButton &&
                    <Button variant='primary' onClick={apply}>{props.applyButton.name}</Button>}
                <Button variant='secondary' onClick={props.onHide}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
}