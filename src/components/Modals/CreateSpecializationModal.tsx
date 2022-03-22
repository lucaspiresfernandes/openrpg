import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SheetModal from './SheetModal';

type CreateSpecializationModalProps = {
    onCreate(name: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateSpecializationModal(props: CreateSpecializationModalProps) {
    const [name, setName] = useState('');

    function reset() {
        setName('');
    }

    return (
        <SheetModal title='Nova Especialização' onExited={reset} show={props.show} onHide={props.onHide}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}>
            <Container fluid>
                <Form.Group controlId='createSpecializationName'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control className='theme-element' value={name}
                        onChange={ev => setName(ev.currentTarget.value)} />
                </Form.Group>
            </Container>
        </SheetModal>
    );
}