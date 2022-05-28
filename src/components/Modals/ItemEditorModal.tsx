import type { Item } from '@prisma/client';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Item = {
	id: 0,
	name: '',
	description: '',
	weight: 0,
	visible: true,
};

export default function ItemEditorModal(props: EditorModalProps<Item>) {
	const [item, setItem] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setItem(props.data);
	}, [props.data]);

	function hide() {
		setItem(initialState);
		props.onHide();
	}

	function onWeightChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newWeight = parseInt(aux);

		if (aux.length === 0) newWeight = 0;
		else if (isNaN(newWeight)) return;

		setItem((eq) => ({ ...eq, weight: newWeight }));
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar' : 'Editar'}
			show={props.show}
			onHide={hide}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(item);
					hide();
				},
				disabled: props.disabled,
			}}>
			<Container fluid>
				<FormGroup controlId='createItemName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={item.name}
						onChange={(ev) => setItem((it) => ({ ...it, name: ev.target.value }))}
					/>
				</FormGroup>
				<FormGroup controlId='createItemDescription' className='mb-3'>
					<FormLabel>Descrição</FormLabel>
					<FormControl
						className='theme-element'
						value={item.description}
						onChange={(ev) => setItem((it) => ({ ...it, description: ev.target.value }))}
					/>
				</FormGroup>
				<FormGroup controlId='createItemWeight' className='mb-3'>
					<FormLabel>Peso</FormLabel>
					<FormControl
						className='theme-element'
						value={item.weight}
						onChange={onWeightChange}
					/>
				</FormGroup>
				<FormCheck
					inline
					checked={item.visible}
					onChange={(ev) => setItem((it) => ({ ...it, visible: ev.target.checked }))}
					id='createItemVisible'
					label='Visível?'
				/>
			</Container>
		</SheetModal>
	);
}
