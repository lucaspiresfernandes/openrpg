import { useState } from 'react';
import { Form } from 'react-bootstrap';
import SheetModal from './SheetModal';

type CreateAttributeModalProps = {
    onCreate(name: string, rollable: boolean): void;
    show: boolean;
    onHide(): void;
}

export default function CreateAttributeModal(props: CreateAttributeModalProps) {
    const [name, setName] = useState('');
    const [rollable, setRollable] = useState(false);

    function reset() {
        setName('');
        setRollable(false);
    }

    return (
        <SheetModal title='Novo Atributo' onExited={reset} show={props.show} onHide={props.onHide}
            applyButton={{ name: 'Criar', onApply: () => props.onCreate(name, rollable) }}>
            <>
                <Form.Group className='mb-3' controlId='createAttributeName'>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control className='theme-element' value={name} onChange={ev => setName(ev.currentTarget.value)} />
                </Form.Group>
                <Form.Group controlId='createAttributeRollable'>
                    <Form.Check inline
                        checked={rollable} onChange={() => setRollable(r => !r)} />
                    <Form.Label>Testável?</Form.Label>
                </Form.Group>
            </>
        </SheetModal>
    );
}