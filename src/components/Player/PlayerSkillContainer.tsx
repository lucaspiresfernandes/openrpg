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
import DiceRollModal from '../Modals/DiceRollModal';

type PlayerSkillContainerProps = {
	playerSkills: {
		value: number;
		checked: boolean;
		modifier: number | null;
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
	npcId?: number;
};

export default function PlayerSkillContainer(props: PlayerSkillContainerProps) {
	const [diceRollResultModalProps, onDiceRoll] = useDiceRoll(props.npcId);

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
			.put('/sheet/player/skill', { id, npcId: props.npcId })
			.then((res) => {
				const skill = res.data.skill;
				setPlayerSkills([...playerSkills, skill]);

				const newSkills = [...availableSkills];
				newSkills.splice(
					newSkills.findIndex((sk) => sk.id === id),
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
			.post('/sheet/player/skill/clearchecks', { npcId: props.npcId })
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
						modifier: skill.modifier,
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
				<Row className='mx-1 text-center justify-content-center'>
					{playerSkillsList.map((skill) => (
						<PlayerSkillField
							key={skill.id}
							{...skill}
							skillDiceConfig={props.skillDiceConfig}
							automaticMarking={props.automaticMarking}
							showDiceRollResult={onDiceRoll}
							notifyClearChecked={notify}
							hidden={!skill.name.toLowerCase().includes(search.toLowerCase())}
							npcId={props.npcId}
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
			<DiceRollModal {...diceRollResultModalProps} />
		</>
	);
}

type PlayerSkillFieldProps = {
	id: number;
	name: string;
	value: number;
	hidden: boolean;
	checked: boolean;
	modifier: number | null;
	skillDiceConfig: DiceConfigCell;
	automaticMarking: boolean;
	notifyClearChecked: boolean;
	showDiceRollResult: DiceRollEvent;
	npcId?: number;
};

function PlayerSkillField(props: PlayerSkillFieldProps) {
	const [value, setValue, isValueClean] = useExtendedState(props.value.toString());
	const [checked, setChecked] = useState(props.checked);
	const [modifier, setModifier, isModifierClean] = useExtendedState(() => {
		const modifier = props.modifier;
		if (modifier === null) return null;

		let mod = modifier.toString();
		if (modifier > -1) mod = `+${mod}`;
		return mod;
	});
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
		api
			.post('/sheet/player/skill', { id: props.id, checked: chk, npcId: props.npcId })
			.catch((err) => {
				logError(err);
				setChecked(checked);
			});
	}

	function onValueBlur() {
		const aux = value;
		let newValue = parseInt(aux);
		if (aux.length === 0 || isNaN(newValue)) {
			newValue = 0;
			setValue(newValue.toString());
		}

		if (isValueClean()) return;

		api
			.post('/sheet/player/skill', { id: props.id, value: newValue, npcId: props.npcId })
			.catch(logError);
	}

	function onModifierBlur() {
		if (!modifier) return;

		const num = parseInt(modifier);

		let newModifier = modifier;
		if (isNaN(num)) newModifier = '+0';
		else if (newModifier === '-0') newModifier = '+0';
		else if (num > 0) newModifier = `+${num}`;

		if (modifier !== newModifier) setModifier(newModifier);

		if (isModifierClean()) return;

		api
			.post('/sheet/player/skill', {
				modifier: parseInt(newModifier),
				id: props.id,
				npcId: props.npcId,
			})
			.catch(logError);
	}

	function rollDice(standalone: boolean) {
		const roll = props.skillDiceConfig.value;
		const branched = props.skillDiceConfig.branched;

		let mod: number | null = null;
		if (modifier) mod = parseInt(modifier);

		const val = parseInt(value);

		props.showDiceRollResult({
			dices: {
				num: standalone ? 1 : undefined,
				roll,
				ref: mod === null ? val : Math.max(1, val + mod),
			},
			resolverKey: `${roll}${branched ? 'b' : ''}`,
			onResult: (results) => {
				const result = results[0];
				if (
					results.length === 1 &&
					props.automaticMarking &&
					result.resultType &&
					result.resultType.successWeight >= 0
				) {
					setChecked(true);
					api
						.post('/sheet/player/skill', {
							id: props.id,
							checked: true,
							npcId: props.npcId,
						})
						.catch((err) => {
							logError(err);
							setChecked(false);
						});
				}
				const _mod = mod;
				if (_mod === null) return;
				return results.map((res) => ({
					roll: Math.max(1, res.roll + _mod),
					resultType: res.resultType,
				}));
			},
		});
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
					<input
						aria-label={checked ? 'Desmarcar' : 'Marcar'}
						type='checkbox'
						checked={checked}
						onChange={onCheckChange}
					/>
				</Col>
			</Row>
			{modifier !== null && (
				<Row className='justify-content-center mb-2'>
					<Col xs={4}>
						<BottomTextInput
							aria-label={`Modificador de ${props.name}`}
							className='text-center w-100'
							value={modifier}
							onChange={(ev) => setModifier(ev.currentTarget.value)}
							onBlur={onModifierBlur}
						/>
					</Col>
				</Row>
			)}
			<Row>
				<Col>
					<BottomTextInput
						aria-label={props.name}
						className='text-center w-75'
						value={value}
						onChange={(ev) => setValue(ev.currentTarget.value)}
						onBlur={onValueBlur}
					/>
				</Col>
			</Row>
			<Row className='h-100' onClick={(ev) => rollDice(ev.ctrlKey)}>
				<Col>{props.name}</Col>
			</Row>
		</Col>
	);
}
