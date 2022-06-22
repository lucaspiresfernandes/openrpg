import type { Skill, Specialization } from '@prisma/client';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import SheetModal from './SheetModal';

type ModalProps = EditorModalProps<Skill> & {
	specializations: Specialization[];
};

const initialState: Skill = {
	id: 0,
	name: '',
	specialization_id: 0,
	mandatory: false,
	startValue: 0,
	visibleToAdmin: false,
};

export default function SkillEditorModal(props: ModalProps) {
	const [skill, setSkill] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setSkill(props.data);
	}, [props.data]);

	function onValueChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.target.value;
		let newValue = parseInt(aux);

		if (aux.length === 0) newValue = 0;
		else if (isNaN(newValue)) return;

		setSkill((sk) => ({ ...sk, startValue: newValue }));
	}

	function hide() {
		setSkill(initialState);
		props.onHide();
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar' : 'Editar'}
			show={props.show}
			onHide={hide}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(skill);
					hide();
				},
				disabled: props.disabled,
			}}>
			<Container fluid>
				<FormGroup controlId='createSkillName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={skill.name}
						onChange={(ev) => setSkill((sk) => ({ ...sk, name: ev.target.value }))}
					/>
				</FormGroup>
				<FormGroup controlId='createSkillSpecialization' className='mb-3'>
					<FormLabel>Especialização</FormLabel>
					<FormSelect
						className='theme-element'
						value={skill.specialization_id || 0}
						onChange={(ev) =>
							setSkill((sk) => ({ ...sk, specialization_id: parseInt(ev.target.value) }))
						}>
						<option value='0'>Nenhuma</option>
						{props.specializations.map((spec) => (
							<option key={spec.id} value={spec.id}>
								{spec.name}
							</option>
						))}
					</FormSelect>
				</FormGroup>
				<FormGroup controlId='createSkillStartValue' className='mb-3'>
					<FormLabel>Valor Inicial</FormLabel>
					<FormControl
						className='theme-element'
						value={skill.startValue}
						onChange={onValueChange}
					/>
				</FormGroup>
				<FormCheck
					inline
					checked={skill.mandatory}
					onChange={(ev) => setSkill((sk) => ({ ...sk, mandatory: ev.target.checked }))}
					id='createSkillMandatory'
					label='Obrigatório?'
				/>
				<FormCheck
					inline
					checked={skill.visibleToAdmin}
					onChange={(ev) =>
						setSkill((sk) => ({ ...sk, visibleToAdmin: ev.target.checked }))
					}
					id='createSkillVisibleToAdmin'
					label='Visível no Painel do Mestre?'
				/>
			</Container>
		</SheetModal>
	);
}
