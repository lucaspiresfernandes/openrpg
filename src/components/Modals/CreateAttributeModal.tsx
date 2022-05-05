import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type CreateAttributeModalProps = {
	onCreate(name: string, rollable: boolean): void;
	show: boolean;
	disabled?: boolean;
	onHide(): void;
};

export default function CreateAttributeModal(props: CreateAttributeModalProps) {
	const [name, setName] = useState('');
	const [rollable, setRollable] = useState(false);

	function reset() {
		setName('');
		setRollable(false);
	}

	return (
		<SheetModal
			title='Novo Atributo'
			onExited={reset}
			show={props.show}
			onHide={props.onHide}
			applyButton={{
				name: 'Criar',
				onApply: () => props.onCreate(name, rollable),
				disabled: props.disabled,
			}}>
			<Container fluid>
				<FormGroup className='mb-3' controlId='createAttributeName'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						className='theme-element'
						value={name}
						onChange={(ev) => setName(ev.currentTarget.value)}
					/>
				</FormGroup>
				<FormCheck
					inline
					checked={rollable}
					onChange={() => setRollable((r) => !r)}
					id='createAttributeRollable'
					label='Testável?'
				/>
			</Container>
		</SheetModal>
	);
}
