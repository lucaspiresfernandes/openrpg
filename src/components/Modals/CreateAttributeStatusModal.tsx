import type { Attribute } from '@prisma/client';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import SheetModal from './SheetModal';

type CreateAttributeStatusModalProps = {
	onCreate: (name: string, attributeID: number) => void;
	show: boolean;
	disabled?: boolean;
	onHide: () => void;
	attributes: Attribute[];
};

export default function CreateAttributeStatusModal(
	props: CreateAttributeStatusModalProps
) {
	const [name, setName] = useState('');
	const [attributeID, setAttributeID] = useState(props.attributes[0]?.id || 0);

	function reset() {
		setName('');
		setAttributeID(props.attributes[0]?.id || 0);
	}

	return (
		<SheetModal
			title='Novo Status de Atributo'
			show={props.show}
			onHide={props.onHide}
			onExited={reset}
			applyButton={{
				name: 'Criar',
				onApply: () => props.onCreate(name, attributeID),
				disabled: props.attributes.length === 0 || props.disabled,
			}}>
			<Container fluid>
				<FormGroup controlId='createStatusName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						className='theme-element'
						value={name}
						onChange={(ev) => setName(ev.currentTarget.value)}
					/>
				</FormGroup>
				<FormGroup controlId='createStatusAttribute' className='mb-3'>
					<FormLabel>Atributo</FormLabel>
					<FormSelect
						value={attributeID}
						className='theme-element'
						onChange={(ev) => setAttributeID(parseInt(ev.currentTarget.value))}>
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
