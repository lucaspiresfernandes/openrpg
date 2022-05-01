import type { Specialization } from '@prisma/client';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import SheetModal from './SheetModal';

type CreateSkillModalProps = {
	onCreate(name: string, mandatory: boolean, specializationID: number | null): void;
	show: boolean;
	onHide(): void;
	specialization: Specialization[];
};

export default function CreateSkillModal(props: CreateSkillModalProps) {
	const [name, setName] = useState('');
	const [specializationID, setSpecializationID] = useState(
		props.specialization[0]?.id || 0
	);
	const [mandatory, setMandatory] = useState(false);

	function reset() {
		setName('');
		setSpecializationID(props.specialization[0]?.id || 0);
		setMandatory(false);
	}

	return (
		<SheetModal
			title='Nova Perícia'
			show={props.show}
			onHide={props.onHide}
			onExited={reset}
			applyButton={{
				name: 'Criar',
				onApply: () => props.onCreate(name, mandatory, specializationID),
			}}>
			<Container fluid>
				<FormGroup controlId='createSkillName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						className='theme-element'
						value={name}
						onChange={(ev) => setName(ev.currentTarget.value)}
					/>
				</FormGroup>
				<FormGroup controlId='createSkillSpecialization' className='mb-3'>
					<FormLabel>Especialização</FormLabel>
					<FormSelect
						value={specializationID || 0}
						className='theme-element'
						onChange={(ev) => setSpecializationID(parseInt(ev.currentTarget.value))}>
						<option value='0'>Nenhuma</option>
						{props.specialization.map((spec) => (
							<option key={spec.id} value={spec.id}>
								{spec.name}
							</option>
						))}
					</FormSelect>
				</FormGroup>
				<FormCheck
					inline
					checked={mandatory}
					onChange={() => setMandatory((r) => !r)}
					id='createSkillMandatory'
					label='Obrigatório?'
				/>
			</Container>
		</SheetModal>
	);
}
