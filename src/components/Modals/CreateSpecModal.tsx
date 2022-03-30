import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SheetModal from './SheetModal';

type CreateSpecModalProps = {
    onCreate(name: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateSpecModal(props: CreateSpecModalProps) {
    const [name, setName] = useState('');

    function reset() {
        setName('');
    }

    return (
        <SheetModal title='Nova Especificação de Personagem' onExited={reset}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}
            show={props.show} onHide={props.onHide} >
            <Container fluid>
                <Form.Group controlId='createSpecName'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control className='theme-element' value={name}
                        onChange={ev => setName(ev.currentTarget.value)} />
                </Form.Group>
            </Container>
        </SheetModal>
    );
}