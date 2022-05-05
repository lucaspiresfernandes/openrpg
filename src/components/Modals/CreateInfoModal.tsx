import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type CreateInfoModalProps = {
	onCreate: (name: string) => void;
	show: boolean;
	disabled?: boolean;
	onHide: () => void;
};

export default function CreateInfoModal(props: CreateInfoModalProps) {
	const [name, setName] = useState('');

	function reset() {
		setName('');
	}

	return (
		<SheetModal
			title='Criar'
			onExited={reset}
			applyButton={{
				name: 'Criar',
				onApply: () => props.onCreate(name),
				disabled: props.disabled,
			}}
			show={props.show}
			onHide={props.onHide}>
			<Container fluid>
				<FormGroup controlId='createInfoName'>
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
