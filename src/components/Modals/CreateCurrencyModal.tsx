import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type CreateCurrencyModalProps = {
	onCreate(name: string): void;
	show: boolean;
	onHide(): void;
};

export default function CreateCurrencyModal(props: CreateCurrencyModalProps) {
	const [name, setName] = useState('');

	function reset() {
		setName('');
	}

	return (
		<SheetModal
			title='Nova Moeda'
			onExited={reset}
			applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}
			show={props.show}
			onHide={props.onHide}>
			<Container fluid>
				<FormGroup controlId='createCurrencyName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						className='theme-element'
						value={name}
						onChange={(ev) => setName(ev.currentTarget.value)}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
