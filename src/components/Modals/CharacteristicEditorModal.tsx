import type { Characteristic } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type ModalProps = EditorModalData<Characteristic> & {
	onSubmit: (char: Characteristic) => void;
	disabled?: boolean;
	onHide: () => void;
};

const initialState: Characteristic = {
	id: 0,
	name: '',
};

export default function CharacteristicEditorModal(props: ModalProps) {
	const [characteristic, setCharacteristic] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setCharacteristic(props.data);
	}, [props.data]);

	function hide() {
		setCharacteristic(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar' : 'Editar'}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(characteristic);
					hide();
				},
				disabled: props.disabled,
			}}
			show={props.show}
			onHide={hide}>
			<Container fluid>
			<FormGroup controlId='createCharacteristicName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={characteristic.name}
						onChange={(ev) => setCharacteristic((i) => ({ ...i, name: ev.target.value }))}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
