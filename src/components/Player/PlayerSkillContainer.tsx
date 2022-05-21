import { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, Socket } from '../../contexts';
import type { DiceRollEvent } from '../../hooks/useDiceRoll';
import useDiceRoll from '../../hooks/useDiceRoll';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import type { DiceConfigCell } from '../../utils/config';
import type {
	SkillAddEvent,
	SkillChangeEvent,
	SkillRemoveEvent,
} from '../../utils/socket';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';
import DiceRollResultModal from '../Modals/DiceRollResultModal';

type PlayerSkillContainerProps = {
	playerSkills: {
		value: number;
		checked: boolean;
		Skill: {
			id: number;
			name: string;
			Specialization: {
				name: string;
			} | null;
		};
	}[];
	availableSkills: {
		id: number;
		name: string;
		Specialization: {
			name: string;
		} | null;
	}[];
	skillDiceConfig: DiceConfigCell;
	title: string;
	automaticMarking: boolean;
};

export default function PlayerSkillContainer(props: PlayerSkillContainerProps) {
	const [diceRollResultModalProps, onDiceRoll] = useDiceRoll();

	const [addSkillShow, setAddSkillShow] = useState(false);
	const [availableSkills, setAvailableSkills] = useState(props.availableSkills);
	const [playerSkills, setPlayerSkills] = useState(props.playerSkills);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [notify, setNotify] = useState(false);

	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	const socket_skillAdd = useRef<SkillAddEvent>(() => {});
	const socket_skillRemove = useRef<SkillRemoveEvent>(() => {});
	const socket_skillChange = useRef<SkillChangeEvent>(() => {});

	useEffect(() => {
		socket_skillAdd.current = (id, name, specializationName) => {
			if (availableSkills.findIndex((sk) => sk.id === id) > -1) return;
			setAvailableSkills((skills) => [
				...skills,
				{
					id,
					name,
					Specialization: specializationName
						? {
								name: specializationName,
						  }
						: null,
				},
			]);
		};

		socket_skillRemove.current = (id) => {
			const availableSkillIndex = availableSkills.findIndex((skill) => skill.id === id);
			if (availableSkillIndex > -1) {
				setAvailableSkills((availableSkills) => {
					const newSkills = [...availableSkills];
					newSkills.splice(availableSkillIndex, 1);
					return newSkills;
				});
				return;
			}

			const playerSkillIndex = playerSkills.findIndex((skill) => skill.Skill.id === id);
			if (playerSkillIndex === -1) return;

			setPlayerSkills((skills) => {
				const newSkills = [...skills];
				newSkills.splice(playerSkillIndex, 1);
				return newSkills;
			});
		};

		socket_skillChange.current = (id, name, specializationName) => {
			const availableSkillIndex = availableSkills.findIndex((skill) => skill.id === id);

			if (availableSkillIndex > -1) {
				setAvailableSkills((skills) => {
					const newSkills = [...skills];
					newSkills[availableSkillIndex] = {
						id,
						name,
						Specialization: specializationName ? { name: specializationName } : null,
					};
					return newSkills;
				});
				return;
			}

			const playerSkillIndex = playerSkills.findIndex((skill) => skill.Skill.id === id);
			if (playerSkillIndex === -1) return;

			setPlayerSkills((skills) => {
				const newSkills = [...skills];
				newSkills[playerSkillIndex].Skill = {
					id,
					name,
					Specialization: specializationName ? { name: specializationName } : null,
				};
				return newSkills;
			});
		};
	});

	useEffect(() => {
		socket.on('skillAdd', (id, name, specializationName) =>
			socket_skillAdd.current(id, name, specializationName)
		);
		socket.on('skillRemove', (id) => socket_skillRemove.current(id));
		socket.on('skillChange', (id, name, specializationName) =>
			socket_skillChange.current(id, name, specializationName)
		);
		return () => {
			socket.off('skillAdd');
			socket.off('skillRemove');
			socket.off('skillChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function onAddSkill(id: number) {
		setLoading(true);
		api
			.put('/sheet/player/skill', { id })
			.then((res) => {
				const skill = res.data.skill;
				setPlayerSkills([...playerSkills, skill]);

				const newSkills = [...availableSkills];
				newSkills.splice(
					newSkills.findIndex((eq) => eq.id === id),
					1
				);
				setAvailableSkills(newSkills);
			})
			.catch(logError)
			.finally(() => {
				setAddSkillShow(false);
				setLoading(false);
			});
	}

	function clearChecks() {
		setLoading(true);
		api
			.post('/sheet/player/skill/clearchecks')
			.then(() => setNotify((n) => !n))
			.catch(logError)
			.finally(() => setLoading(false));
	}

	const playerSkillsList = useMemo(
		() =>
			playerSkills
				.map((skill) => {
					let name = skill.Skill.name;
					if (skill.Skill.Specialization)
						name = `${skill.Skill.Specialization.name} (${name})`;
					return {
						name,
						id: skill.Skill.id,
						value: skill.value,
						checked: skill.checked,
					};
				})
				.sort((a, b) => a.name.localeCompare(b.name)),
		[playerSkills]
	);

	const availableSkillsList = useMemo(
		() =>
			availableSkills.map((skill) => {
				let name = skill.name;
				if (skill.Specialization) name = `${skill.Specialization.name} (${name})`;
				return {
					id: skill.id,
					name,
				};
			}),
		[availableSkills]
	);

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setAddSkillShow(true), disabled: loading }}>
				<Row className='mb-3 justify-content-center'>
					<Col xs={12} sm={6} md={8} lg={9} xxl={10}>
						<FormControl
							disabled={loading}
							className='theme-element'
							placeholder='Procurar'
							value={search}
							onChange={(ev) => setSearch(ev.currentTarget.value)}
						/>
					</Col>
					<Col xs='auto' className='mt-3 mt-sm-0'>
						<Button variant='secondary' onClick={clearChecks} disabled={loading}>
							Limpar Marcadores
						</Button>
					</Col>
				</Row>
				<Row className='mb-3 mx-1 text-center justify-content-center'>
					{playerSkillsList.map((skill) => (
						<PlayerSkillField
							key={skill.id}
							{...skill}
							skillDiceConfig={props.skillDiceConfig}
							automaticMarking={props.automaticMarking}
							showDiceRollResult={onDiceRoll}
							notifyClearChecked={notify}
							hidden={!skill.name.toLowerCase().includes(search.toLowerCase())}
						/>
					))}
				</Row>
			</DataContainer>
			<AddDataModal
				title='Adicionar'
				show={addSkillShow}
				onHide={() => setAddSkillShow(false)}
				data={availableSkillsList}
				onAddData={onAddSkill}
				disabled={loading}
			/>
			<DiceRollResultModal {...diceRollResultModalProps} />
		</>
	);
}

type PlayerSkillFieldProps = {
	id: number;
	name: string;
	value: number;
	hidden: boolean;
	checked: boolean;
	skillDiceConfig: DiceConfigCell;
	automaticMarking: boolean;
	notifyClearChecked: boolean;
	showDiceRollResult: DiceRollEvent;
};

function PlayerSkillField(props: PlayerSkillFieldProps) {
	const [value, setValue, isClean] = useExtendedState(props.value);
	const [checked, setChecked] = useState(props.checked);
	const componentDidMount = useRef(false);
	const logError = useContext(ErrorLogger);

	useEffect(() => {
		if (!componentDidMount.current) {
			componentDidMount.current = true;
			return;
		}
		if (checked) setChecked(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.notifyClearChecked]);

	function onCheckChange(ev: ChangeEvent<HTMLInputElement>) {
		const chk = ev.target.checked;
		setChecked(chk);
		api.post('/sheet/player/skill', { id: props.id, checked: chk }).catch((err) => {
			logError(err);
			setChecked(checked);
		});
	}

	function onValueChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newValue = parseInt(aux);

		if (aux.length === 0) newValue = 0;
		else if (isNaN(newValue)) return;

		setValue(newValue);
	}

	function valueBlur() {
		if (isClean()) return;
		api.post('/sheet/player/skill', { id: props.id, value }).catch(logError);
	}

	function rollDice() {
		const roll = props.skillDiceConfig.value;
		const branched = props.skillDiceConfig.branched;
		props.showDiceRollResult(
			[{ num: 1, roll, ref: value }],
			`${roll}${branched ? 'b' : ''}`,
			(results) => {
				const result = results[0];
				if (!props.automaticMarking || !result.resultType?.isSuccess || checked) return;
				setChecked(true);
				api.post('/sheet/player/skill', { id: props.id, checked: true }).catch((err) => {
					logError(err);
					setChecked(false);
				});
			}
		);
	}

	if (props.hidden) return null;

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
						className='text-center w-75'
						value={value}
						onChange={onValueChange}
						onBlur={valueBlur}
					/>
				</Col>
			</Row>
			<Row className='h-100' onClick={rollDice}>
				<Col>{props.name}</Col>
			</Row>
		</Col>
	);
}
