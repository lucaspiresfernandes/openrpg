import type { ExtraInfo } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: ExtraInfo = {
	id: 0,
	name: '',
};

export default function ExtraInfoEditorModal(props: EditorModalProps<ExtraInfo>) {
	const [info, setInfo] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setInfo(props.data);
	}, [props.data]);

	function hide() {
		setInfo(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar Informação' : 'Editar Informação'}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(info);
					hide();
				},
				disabled: props.disabled,
			}}
			show={props.show}
			onHide={hide}>
			<Container fluid>
				<FormGroup controlId='createExtraInfoName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={info.name}
						onChange={(ev) => setInfo((i) => ({ ...i, name: ev.target.value }))}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
