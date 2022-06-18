import type { Spec } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Spec = {
	id: 0,
	name: '',
	visibleToAdmin: true,
};

export default function SpecEditorModal(props: EditorModalProps<Spec>) {
	const [spec, setSpec] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setSpec(props.data);
	}, [props.data]);

	function hide() {
		setSpec(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar Informação' : 'Editar Informação'}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(spec);
					hide();
				},
				disabled: props.disabled,
			}}
			show={props.show}
			onHide={hide}>
			<Container fluid>
				<FormGroup className='mb-3' controlId='createSpecName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={spec.name}
						onChange={(ev) => setSpec((i) => ({ ...i, name: ev.target.value }))}
					/>
				</FormGroup>
				<FormCheck
					inline
					checked={spec.visibleToAdmin}
					onChange={(ev) =>
						setSpec((spec) => ({ ...spec, visibleToAdmin: ev.target.checked }))
					}
					id='createSpecVisibleToAdmin'
					label='Visível no Painel do Mestre?'
				/>
			</Container>
		</SheetModal>
	);
}
