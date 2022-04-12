import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
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
                <FormGroup controlId='createSpecName'>
                    <FormLabel>Nome</FormLabel>
                    <FormControl className='theme-element' value={name}
                        onChange={ev => setName(ev.currentTarget.value)} />
                </FormGroup>
            </Container>
        </SheetModal>
    );
}