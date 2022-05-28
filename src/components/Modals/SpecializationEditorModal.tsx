import type { Specialization } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Specialization = {
	id: 0,
	name: '',
};

export default function SpecializationEditorModal(
	props: EditorModalProps<Specialization>
) {
	const [specialization, setSpecialization] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setSpecialization(props.data);
	}, [props.data]);

	function hide() {
		setSpecialization(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={
				props.operation === 'create' ? 'Criar Especialização' : 'Editar Especialização'
			}
			applyButton={{
				name:
					props.operation === 'create' ? 'Criar Especialização' : 'Editar Especialização',
				onApply: () => {
					props.onSubmit(specialization);
					hide();
				},
				disabled: props.disabled,
			}}
			show={props.show}
			onHide={hide}>
			<Container fluid>
				<FormGroup controlId='createSpecializationName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={specialization.name}
						onChange={(ev) => setSpecialization((i) => ({ ...i, name: ev.target.value }))}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
