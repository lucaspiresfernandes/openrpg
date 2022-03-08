import { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import SheetModal from './SheetModal';

type AddEquipmentModalProps = {
    show: boolean;
    onHide(): void;
    onAddEquipment(id: number): void;
    equipments: { id: number, name: string }[]
}

export default function AddEquipmentModal(props: AddEquipmentModalProps) {
    const [value, setValue] = useState(props.equipments[0].id);

    useEffect(() => {
        setValue(props.equipments[0].id);
    }, [props.equipments]);

    return (
        <SheetModal title='Adicionar Equipamento' show={props.show} onHide={props.onHide}
            applyButton={{ name: 'Adicionar', onApply: () => props.onAddEquipment(value) }}>
            <Container fluid>
                <Form.Select className='theme-element' value={value} onChange={ev => setValue(parseInt(ev.currentTarget.value))}>
                    {props.equipments.map(eq =>
                        <option key={eq.id} value={`${eq.id}`}>{eq.name}</option>
                    )}
                </Form.Select>
            </Container>
        </SheetModal>
    );
}