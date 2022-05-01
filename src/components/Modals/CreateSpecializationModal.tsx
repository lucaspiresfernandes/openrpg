import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type CreateSpecializationModalProps = {
	onCreate(name: string): void;
	show: boolean;
	onHide(): void;
};

export default function CreateSpecializationModal(props: CreateSpecializationModalProps) {
	const [name, setName] = useState('');

	function reset() {
		setName('');
	}

	return (
		<SheetModal
			title='Nova Especialização'
			onExited={reset}
			show={props.show}
			onHide={props.onHide}
			applyButton={{ name: 'Criar', onApply: () => props.onCreate(name) }}>
			<Container fluid>
				<FormGroup controlId='createSpecializationName'>
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
