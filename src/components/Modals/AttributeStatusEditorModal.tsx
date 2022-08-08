import type { Attribute, AttributeStatus } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import SheetModal from './SheetModal';

type ModalProps = EditorModalProps<AttributeStatus> & {
	attributes: Attribute[];
};

export default function AttributeStatusEditorModal(props: ModalProps) {
	const initialState: AttributeStatus = {
		id: 0,
		name: '',
		attribute_id: props.attributes[0]?.id || 0,
	};

	const [attributeStatus, setAttributeStatus] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setAttributeStatus(props.data);
	}, [props.data]);

	function hide() {
		setAttributeStatus(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={
				props.operation === 'create'
					? 'Criar Status de Atributo'
					: 'Editar Status de Atributo'
			}
			show={props.show}
			onHide={hide}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(attributeStatus);
					hide();
				},
				disabled: props.attributes.length === 0 || props.disabled,
			}}>
			<Container fluid>
				<FormGroup controlId='createStatusName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={attributeStatus.name}
						onChange={(ev) =>
							setAttributeStatus((attr) => ({ ...attr, name: ev.target.value }))
						}
					/>
				</FormGroup>
				<FormGroup controlId='createStatusAttribute' className='mb-3'>
					<FormLabel>Atributo</FormLabel>
					<FormSelect
						className='theme-element'
						value={attributeStatus.attribute_id}
						onChange={(ev) =>
							setAttributeStatus((attr) => ({
								...attr,
								attribute_id: parseInt(ev.target.value),
							}))
						}>
						{props.attributes.map((attr) => (
							<option key={attr.id} value={attr.id}>
								{attr.name}
							</option>
						))}
					</FormSelect>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
