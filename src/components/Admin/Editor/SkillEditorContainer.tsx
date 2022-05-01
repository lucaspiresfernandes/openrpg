import type { Skill, Specialization } from '@prisma/client';
import type { ChangeEvent } from 'react';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import Row from 'react-bootstrap/Row';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import DataContainer from '../../DataContainer';
import CreateSkillModal from '../../Modals/CreateSkillModal';
import CreateSpecializationModal from '../../Modals/CreateSpecializationModal';
import AdminTable from '../AdminTable';

type SkillEditorContainerProps = {
	skills: Skill[];
	specializations: Specialization[];
};

export default function SkillEditorContainer(props: SkillEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showSkillModal, setShowSkillModal] = useState(false);
	const [skills, setSkills] = useState(props.skills);
	const [showSpecModal, setShowSpecModal] = useState(false);
	const [specializations, setSpecializations] = useState(props.specializations);

	function createSkill(
		name: string,
		mandatory: boolean,
		specializationID: number | null
	) {
		api
			.put('/sheet/skill', { name, specializationID, mandatory })
			.then((res) => {
				const id = res.data.id;
				setSkills([
					...skills,
					{ id, name, specialization_id: specializationID, mandatory },
				]);
			})
			.catch(logError);
	}

	function deleteSkill(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/skill', { data: { id } })
			.then(() => {
				const newSkill = [...skills];
				const index = newSkill.findIndex((skill) => skill.id === id);
				if (index > -1) {
					newSkill.splice(index, 1);
					setSkills(newSkill);
				}
			})
			.catch(logError);
	}

	function onSpecializationNameChange(id: number, name: string) {
		const newSpecializations = [...specializations];
		const sp = newSpecializations.find((sp) => sp.id === id);
		if (sp) {
			sp.name = name;
			setSpecializations(newSpecializations);
		}
	}

	function createSpecialization(name: string) {
		api
			.put('/sheet/specialization', { name })
			.then((res) => {
				const id = res.data.id;
				setSpecializations([...specializations, { id, name }]);
			})
			.catch(logError);
	}

	function deleteSpecialization(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/specialization', { data: { id } })
			.then(() => {
				const newSpec = [...specializations];
				const index = newSpec.findIndex((specialization) => specialization.id === id);
				if (index > -1) {
					newSpec.splice(index, 1);
					setSpecializations(newSpec);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<Row>
				<DataContainer
					outline
					title='Especializações'
					addButton={{ onAdd: () => setShowSpecModal(true) }}>
					<Row>
						<Col>
							<AdminTable>
								<thead>
									<tr>
										<th></th>
										<th title='Nome da Especialização.'>Nome</th>
									</tr>
								</thead>
								<tbody>
									{specializations.map((specialization) => (
										<SpecializationEditorField
											key={specialization.id}
											specialization={specialization}
											onDelete={deleteSpecialization}
											onNameChange={onSpecializationNameChange}
										/>
									))}
								</tbody>
							</AdminTable>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<Row>
				<DataContainer
					outline
					title='Perícias'
					addButton={{ onAdd: () => setShowSkillModal(true) }}>
					<Row>
						<Col>
							<AdminTable>
								<thead>
									<tr>
										<th></th>
										<th title='Nome da Perícia.'>Nome</th>
										<th title='Define qual Especialização será ligada à Perícia.'>
											Especialização
										</th>
										<th title='Define se essa Perícia será obrigatória a um jogador ter.'>
											Obrigatório
										</th>
									</tr>
								</thead>
								<tbody>
									{skills.map((skill) => (
										<SkillEditorField
											key={skill.id}
											skill={skill}
											onDelete={deleteSkill}
											specializations={specializations}
										/>
									))}
								</tbody>
							</AdminTable>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<CreateSpecializationModal
				show={showSpecModal}
				onHide={() => setShowSpecModal(false)}
				onCreate={createSpecialization}
			/>
			<CreateSkillModal
				show={showSkillModal}
				onHide={() => setShowSkillModal(false)}
				onCreate={createSkill}
				specialization={specializations}
			/>
		</>
	);
}

type SkillEditorFieldProps = {
	skill: Skill;
	specializations: Specialization[];
	onDelete(id: number): void;
};

function SkillEditorField(props: SkillEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.skill.name);
	const [specializationID, setSpecializationID] = useState(props.skill.specialization_id);
	const [mandatory, setMandatory] = useState(props.skill.mandatory);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/skill', { id: props.skill.id, name }).catch(logError);
	}

	function specializationChange(ev: ChangeEvent<HTMLSelectElement>) {
		const sID = parseInt(ev.currentTarget.value);
		setSpecializationID(sID);
		api
			.post('/sheet/skill', { id: props.skill.id, specializationID: sID })
			.catch((err) => {
				logError(err);
				setSpecializationID(specializationID);
			});
	}

	function mandatoryChange() {
		const newMandatory = !mandatory;
		setMandatory(newMandatory);
		api
			.post('/sheet/skill', { id: props.skill.id, mandatory: newMandatory })
			.catch((err) => {
				setMandatory(mandatory);
				logError(err);
			});
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.skill.id)}
					size='sm'
					variant='secondary'>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
				/>
			</td>
			<td>
				<select
					className='theme-element'
					value={specializationID || 0}
					onChange={specializationChange}>
					<option value={0}>Nenhuma</option>
					{props.specializations.map((attr) => (
						<option key={attr.id} value={attr.id}>
							{attr.name}
						</option>
					))}
				</select>
			</td>
			<td>
				<FormCheck checked={mandatory} onChange={mandatoryChange} />
			</td>
		</tr>
	);
}

type SpecializationEditorFieldProps = {
	specialization: Specialization;
	onDelete(id: number): void;
	onNameChange?(id: number, newName: string): void;
};

function SpecializationEditorField(props: SpecializationEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.specialization.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		if (props.onNameChange) props.onNameChange(props.specialization.id, name);
		api
			.post('/sheet/specialization', { id: props.specialization.id, name })
			.catch(logError);
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.specialization.id)}
					size='sm'
					variant='secondary'>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
				/>
			</td>
		</tr>
	);
}
