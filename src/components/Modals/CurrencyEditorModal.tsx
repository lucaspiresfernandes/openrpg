import type { Currency } from '@prisma/client';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Currency = {
	id: 0,
	name: '',
};

export default function CurrencyEditorModal(props: EditorModalProps<Currency>) {
	const [currency, setCurrency] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setCurrency(props.data);
	}, [props.data]);

	function hide() {
		setCurrency(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar' : 'Editar'}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(currency);
					hide();
				},
				disabled: props.disabled,
			}}
			show={props.show}
			onHide={hide}>
			<Container fluid>
			<FormGroup controlId='createCurrencyName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={currency.name}
						onChange={(ev) => setCurrency((i) => ({ ...i, name: ev.target.value }))}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}