import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SheetModal from './SheetModal';

type CreateInfoModalProps = {
    onCreate(name: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateInfoModal(props: CreateInfoModalProps) {
    const [name, setName] = useState('');

    function reset() {
        setName('');
    }

    return (
        <SheetModal title='Nova Informação Pessoal (Geral)' onExited={reset}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}
            show={props.show} onHide={props.onHide} >
            <Container fluid>
                <Form.Group controlId='createInfoName'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                </Form.Group>
            </Container>
        </SheetModal>
    );
}