import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type CreateItemModalProps = {
	onCreate: (name: string, description: string) => void;
	show: boolean;
	disabled?: boolean;
	onHide: () => void;
};

export default function CreateItemModal(props: CreateItemModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	function reset() {
		setName('');
		setDescription('');
	}

	return (
		<SheetModal
			title='Novo Item'
			show={props.show}
			onHide={props.onHide}
			onExited={reset}
			applyButton={{
				name: 'Criar',
				onApply: () => props.onCreate(name, description),
				disabled: props.disabled,
			}}>
			<Container fluid>
				<FormGroup controlId='createItemName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						className='theme-element'
						value={name}
						onChange={(ev) => setName(ev.currentTarget.value)}
					/>
				</FormGroup>
				<FormGroup controlId='createItemName' className='mb-3'>
					<FormLabel>Descrição</FormLabel>
					<FormControl
						className='theme-element'
						value={description}
						onChange={(ev) => setDescription(ev.currentTarget.value)}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
