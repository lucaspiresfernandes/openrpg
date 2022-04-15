import { Skill } from '@prisma/client';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, ShowDiceResult, Socket } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';

type PlayerSkill = {
	value: number;
	checked: boolean;
	Skill: {
		id: number;
		name: string;
		Specialization: {
			name: string;
		} | null;
	};
};

type PlayerSkillContainerProps = {
	playerSkills: PlayerSkill[];
	availableSkills: Skill[];
	skillDiceConfig: {
		value: number;
		branched: boolean;
	};
	title: string;
};

export default function PlayerSkillContainer(props: PlayerSkillContainerProps) {
	const [addSkillShow, setAddSkillShow] = useState(false);
	const [skills, setSkills] = useState<{ id: number; name: string }[]>(
		props.availableSkills
	);
	const [playerSkills, setPlayerSkills] = useState(props.playerSkills);
	const [search, setSearch] = useState('');

	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	function onAddSkill(id: number) {
		api
			.put('/sheet/player/skill', { id })
			.then((res) => {
				const skill = res.data.skill;
				setPlayerSkills([...playerSkills, skill]);

				const newSkills = [...skills];
				newSkills.splice(
					newSkills.findIndex((eq) => eq.id === id),
					1
				);
				setSkills(newSkills);
			})
			.catch(logError);
	}

	useEffect(() => {
		if (!socket) return;

		socket.on('playerSkillChange', (id, name, Specialization) => {
			setPlayerSkills((skills) => {
				const index = skills.findIndex((skill) => skill.Skill.id === id);
				if (index === -1) return skills;

				const newSkills = [...skills];
				newSkills[index].Skill = { id, name, Specialization };
				return newSkills;
			});

			setSkills((skills) => {
				const index = skills.findIndex((skill) => skill.id === id);
				if (index === -1) return skills;

				const newSkills = [...skills];
				newSkills[index].name = name;
				return newSkills;
			});
		});

		return () => {
			socket.off('playerSkillChange');
		};
	}, [socket]);

	function clearChecks() {
		setPlayerSkills((skills) =>
			skills.map((skill) => {
				return {
					Skill: { ...skill.Skill },
					checked: false,
					value: skill.value,
				};
			})
		);
	}

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setAddSkillShow(true) }}>
				<Row className='mb-3'>
					<Col>
						<FormControl
							className='theme-element'
							placeholder='Procurar'
							value={search}
							onChange={(ev) => setSearch(ev.currentTarget.value)}
						/>
					</Col>
					<Col xs='auto' className='me-2'>
						<Button variant='secondary' onClick={clearChecks}>
							Limpar Marcadores
						</Button>
					</Col>
				</Row>
				<Row className='mb-3 mx-1 text-center justify-content-center'>
					{playerSkills.map((skill) => {
						if (skill.Skill.name.toLowerCase().includes(search.toLowerCase()))
							return (
								<PlayerSkillField
									key={skill.Skill.id}
									skill={skill}
									skillDice={props.skillDiceConfig}
								/>
							);
						return null;
					})}
				</Row>
			</DataContainer>
			<AddDataModal
				title='Adicionar'
				show={addSkillShow}
				onHide={() => setAddSkillShow(false)}
				data={skills}
				onAddData={onAddSkill}
			/>
		</>
	);
}

type PlayerSkillFieldProps = {
	skill: PlayerSkill;
	skillDice: {
		value: number;
		branched: boolean;
	};
};

function PlayerSkillField({ skill, skillDice }: PlayerSkillFieldProps) {
	const [lastValue, value, setValue] = useExtendedState(skill.value);
	const [checked, setChecked] = useState(skill.checked);
	const logError = useContext(ErrorLogger);
	const showDiceRollResult = useContext(ShowDiceResult);
	const firstUpdate = useRef(true);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}

		if (skill.checked === checked) return;
		
		setChecked(skill.checked);
		api.post('/sheet/player/skill', { id: skill.Skill.id, checked: skill.checked }).catch((err) => {
			logError(err);
			setChecked(checked);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skill]);

	function onCheckChange(ev: ChangeEvent<HTMLInputElement>) {
		const c = ev.target.checked;
		setChecked(c);
		api.post('/sheet/player/skill', { id: skill.Skill.id, checked: c }).catch((err) => {
			logError(err);
			setChecked(checked);
		});
	}

	function valueChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newValue = parseInt(aux);

		if (aux.length === 0) newValue = 0;
		else if (isNaN(newValue)) return;

		setValue(newValue);
	}

	function valueBlur() {
		if (value === lastValue) return;
		setValue(value);
		api.post('/sheet/player/skill', { id: skill.Skill.id, value }).catch((err) => {
			logError(err);
			setValue(lastValue);
		});
	}

	function rollDice() {
		const roll = skillDice['value'];
		const branched = skillDice['branched'];
		showDiceRollResult([{ num: 1, roll, ref: value }], `${roll}${branched ? 'b' : ''}`);
	}

	let name = skill.Skill.name;
	if (skill.Skill.Specialization) name = `${skill.Skill.Specialization.name} (${name})`;

	return (
		<Col
			xs={6}
			md={3}
			xl={2}
			className='skill-container my-3 clickable d-flex flex-column'>
			<Row className='mb-1'>
				<Col>
					<input type='checkbox' checked={checked} onChange={onCheckChange} />
				</Col>
			</Row>
			<Row>
				<Col>
					<BottomTextInput
						className='text text-center w-75'
						value={value}
						onChange={valueChange}
						onBlur={valueBlur}
					/>
				</Col>
			</Row>
			<Row className='label h-100' onClick={rollDice}>
				<Col>{name}</Col>
			</Row>
		</Col>
	);
}
