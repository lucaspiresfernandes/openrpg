import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import SheetModal from './SheetModal';

type CreateCharacteristicModalProps = {
    onCreate(name: string): void;
    show: boolean;
    onHide(): void;
}

export default function CreateCharacteristicModal(props: CreateCharacteristicModalProps) {
    const [name, setName] = useState('');

    function reset() {
        setName('');
    }

    return (
        <SheetModal title='Nova Característica'
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}
            show={props.show} onHide={props.onHide} onExited={reset} >
            <Container fluid>
                <Form.Group className='mb-3' controlId='createCharacteristicName'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                </Form.Group>
            </Container>
        </SheetModal>
    );
}