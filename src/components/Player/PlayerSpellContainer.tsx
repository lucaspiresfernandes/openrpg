import type { Spell } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { ErrorLogger, Socket } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import type {
	SpellAddEvent,
	SpellChangeEvent,
	SpellRemoveEvent,
} from '../../utils/socket';
import BottomTextInput from '../BottomTextInput';
import CustomSpinner from '../CustomSpinner';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';
import { resolveDices } from '../../utils/dice';
import type { DiceRollEvent } from '../../hooks/useDiceRoll';
import DiceRollModal from '../Modals/DiceRollModal';
import useDiceRoll from '../../hooks/useDiceRoll';

type PlayerSpellContainerProps = {
	title: string;
	playerSpells: Spell[];
	availableSpells: Spell[];
	playerMaxSlots: number;
	npcId?: number;
};

export default function PlayerSpellContainer(props: PlayerSpellContainerProps) {
	const [addSpellShow, setAddSpellShow] = useState(false);
	const [availableSpells, setAvailableSpells] = useState<{ id: number; name: string }[]>(
		props.availableSpells
	);
	const [playerSpells, setPlayerSpells] = useState(props.playerSpells);
	const [maxSlots, setMaxSlots, isClean] = useExtendedState(
		props.playerMaxSlots.toString()
	);
	const [loading, setLoading] = useState(false);

	const logError = useContext(ErrorLogger);
	const socket = useContext(Socket);
	const [diceRoll, rollDice] = useDiceRoll(props.npcId);

	const socket_spellAdd = useRef<SpellAddEvent>(() => {});
	const socket_spellRemove = useRef<SpellRemoveEvent>(() => {});
	const socket_spellChange = useRef<SpellChangeEvent>(() => {});

	useEffect(() => {
		socket_spellAdd.current = (id, name) => {
			if (availableSpells.findIndex((sp) => sp.id === id) > -1) return;
			setAvailableSpells((spells) => [...spells, { id, name }]);
		};

		socket_spellRemove.current = (id) => {
			const index = playerSpells.findIndex((spell) => spell.id === id);
			if (index === -1) return;
			setPlayerSpells((spell) => {
				const newSpells = [...spell];
				newSpells.splice(index, 1);
				return newSpells;
			});
		};

		socket_spellChange.current = (sp) => {
			const availableIndex = availableSpells.findIndex((_sp) => _sp.id === sp.id);
			const playerIndex = playerSpells.findIndex((_sp) => _sp.id === sp.id);

			if (sp.visible) {
				if (availableIndex === -1 && playerIndex === -1)
					return setAvailableSpells((spells) => [...spells, sp]);
			} else if (availableIndex > -1) {
				return setAvailableSpells((spells) => {
					const newSpells = [...spells];
					newSpells.splice(availableIndex, 1);
					return newSpells;
				});
			}

			if (availableIndex > -1) {
				setAvailableSpells((spells) => {
					const newSpells = [...spells];
					newSpells[availableIndex] = sp;
					return newSpells;
				});
				return;
			}

			if (playerIndex === -1) return;

			setPlayerSpells((spells) => {
				const newSpells = [...spells];
				newSpells[playerIndex] = sp;
				return newSpells;
			});
		};
	});

	useEffect(() => {
		socket.on('spellAdd', (id, name) => socket_spellAdd.current(id, name));
		socket.on('spellRemove', (id) => socket_spellRemove.current(id));
		socket.on('spellChange', (spell) => socket_spellChange.current(spell));
		return () => {
			socket.off('spellAdd');
			socket.off('spellRemove');
			socket.off('spellChange');
		};
	});

	function onAddSpell(id: number) {
		setLoading(true);
		api
			.put('/sheet/player/spell', { id, npcId: props.npcId })
			.then((res) => {
				const spell = res.data.spell as Spell;
				setPlayerSpells([...playerSpells, spell]);

				const newSpells = [...availableSpells];
				newSpells.splice(
					newSpells.findIndex((spell) => spell.id === id),
					1
				);
				setAvailableSpells(newSpells);
			})
			.catch(logError)
			.finally(() => {
				setAddSpellShow(false);
				setLoading(false);
			});
	}

	function onDeleteSpell(id: number) {
		const newPlayerSpells = [...playerSpells];
		const index = newPlayerSpells.findIndex((spell) => spell.id === id);

		newPlayerSpells.splice(index, 1);
		setPlayerSpells(newPlayerSpells);

		const modalSpell = { id, name: playerSpells[index].name };
		setAvailableSpells([...availableSpells, modalSpell]);
	}

	function onMaxSlotsBlur() {
		if (isClean()) return;
		let maxSlotsFloat = parseFloat(maxSlots);
		if (isNaN(maxSlotsFloat)) {
			maxSlotsFloat = 0;
			setMaxSlots(maxSlotsFloat.toString());
		} else setMaxSlots(maxSlots);
		api.post('/sheet/player', { maxSlots: maxSlotsFloat, npcId: props.npcId }).catch(logError);
	}

	const slots = playerSpells.reduce((prev, cur) => prev + cur.slots, 0);
	const colorStyle = { color: slots > parseFloat(maxSlots) ? 'red' : 'inherit' };

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setAddSpellShow(true), disabled: loading }}>
				<Row className='mb-2'>
					<Col className='text-center h5'>
						<span className='me-2'>Espaços: </span>
						<span style={colorStyle}> {slots} /</span>
						<BottomTextInput
							value={maxSlots}
							onChange={(ev) => setMaxSlots(ev.currentTarget.value)}
							onBlur={onMaxSlotsBlur}
							className='text-center'
							style={{ ...colorStyle, maxWidth: '3rem' }}
							disabled={loading}
						/>
					</Col>
				</Row>
				<Row>
					{playerSpells.map((spell) => (
						<PlayerSpellField
							key={spell.id}
							spell={spell}
							onDelete={onDeleteSpell}
							showDiceRollResult={rollDice}
							npcId={props.npcId}
						/>
					))}
				</Row>
			</DataContainer>
			<AddDataModal
				title='Adicionar'
				show={addSpellShow}
				onHide={() => setAddSpellShow(false)}
				data={availableSpells}
				onAddData={onAddSpell}
				disabled={loading}
			/>
			<DiceRollModal {...diceRoll} />
		</>
	);
}

type PlayerSpellFieldProps = {
	spell: Spell;
	onDelete: (id: number) => void;
	showDiceRollResult: DiceRollEvent;
	npcId?: number;
};

function PlayerSpellField({
	spell,
	onDelete,
	showDiceRollResult,
	npcId
}: PlayerSpellFieldProps) {
	const logError = useContext(ErrorLogger);
	const [loading, setLoading] = useState(false);

	function deleteSpell() {
		if (!confirm('Tem certeza que deseja apagar essa magia?')) return;
		setLoading(true);
		api
			.delete('/sheet/player/spell', { data: { id: spell.id, npcId } })
			.then(() => {
				onDelete(spell.id);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function diceRoll() {
		const aux = resolveDices(spell.damage);
		if (aux) showDiceRollResult({ dices: aux });
	}

	return (
		<Col xs={12} className='mb-3 w-100 text-center'>
			<Row>
				<Col className='data-container mx-3'>
					<Row className='mt-2'>
						<Col className='h2'>
							{spell.name}
							<Button
								aria-label='Apagar'
								className='ms-3'
								variant='secondary'
								size='sm'
								onClick={deleteSpell}
								disabled={loading}>
								{loading ? <CustomSpinner /> : 'Apagar'}
							</Button>
						</Col>
					</Row>
					<Row>
						<Col className='h5 spell-description'>{spell.description}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Custo: {spell.cost}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Tipo: {spell.type}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>
							<span className='me-1'>Dano: {spell.damage} </span>
							{spell.damage !== '-' && (
								<Image
									alt='Dado'
									src='/dice20.webp'
									className='clickable'
									onClick={diceRoll}
									style={{ maxHeight: '2rem' }}
								/>
							)}
						</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Alvo: {spell.target}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Tempo de Conjuração: {spell.castingTime}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Alcance: {spell.range}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Duração: {spell.duration}</Col>
					</Row>
					<Row className='mb-2'>
						<Col>Espaços Utilizados: {spell.slots}</Col>
					</Row>
				</Col>
			</Row>
		</Col>
	);
}
