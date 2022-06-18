import type { Info } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Info = {
	id: 0,
	name: '',
	visibleToAdmin: false,
};

export default function InfoEditorModal(props: EditorModalProps<Info>) {
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
				<FormGroup className='mb-3' controlId='createInfoName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={info.name}
						onChange={(ev) => setInfo((i) => ({ ...i, name: ev.target.value }))}
					/>
				</FormGroup>
				<FormCheck
					inline
					checked={info.visibleToAdmin}
					onChange={(ev) =>
						setInfo((info) => ({ ...info, visibleToAdmin: ev.target.checked }))
					}
					id='createInfoVisibleToAdmin'
					label='Visível no Painel do Mestre?'
				/>
			</Container>
		</SheetModal>
	);
}
