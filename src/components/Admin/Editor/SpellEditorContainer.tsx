import type { Spell } from '@prisma/client';
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
import CreateSpellModal from '../../Modals/CreateSpellModal';
import AdminTable from '../AdminTable';

type SpellEditorContainerProps = {
	spells: Spell[];
	title: string;
};

export default function SpellEditorContainer(props: SpellEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showSpellModal, setShowSpellModal] = useState(false);
	const [spell, setSpell] = useState(props.spells);

	function createSpell(
		name: string,
		description: string,
		cost: string,
		type: string,
		damage: string,
		castingTime: string,
		range: string,
		duration: string,
		slots: number,
		target: string
	) {
		api
			.put('/sheet/spell', {
				name,
				description,
				cost,
				type,
				damage,
				castingTime,
				range,
				duration,
				slots,
				target,
			})
			.then((res) => {
				const id = res.data.id;
				setSpell([
					...spell,
					{
						id,
						name,
						description,
						cost,
						type,
						damage,
						castingTime,
						range,
						duration,
						slots,
						target,
						visible: true,
					},
				]);
			})
			.catch(logError);
	}

	function deleteSpell(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse spell?')) return;
		api
			.delete('/sheet/spell', { data: { id } })
			.then(() => {
				const newSpell = [...spell];
				const index = newSpell.findIndex((spell) => spell.id === id);
				if (index > -1) {
					newSpell.splice(index, 1);
					setSpell(newSpell);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setShowSpellModal(true) }}>
				<Row>
					<Col>
						<AdminTable centerText>
							<thead>
								<tr>
									<th></th>
									<th title='Nome da Magia.'>Nome</th>
									<th title='Descrição da Magia.'>Descrição</th>
									<th title='Custo da Magia.'>Custo</th>
									<th title='Tipo da Magia.'>Tipo</th>
									<th title='Dano da Magia.'>Dano</th>
									<th title='Alvo da Magia. Pode ser próprio, único, múltiplo ou área (especifique o tamanho).'>
										Alvo
									</th>
									<th title='Tempo de conjuração da Magia.'>Tempo de Conjuração</th>
									<th title='Alcance, em metros, da Magia.'>Alcance</th>
									<th title='Duração da Magia.'>Duração</th>
									<th title='Unidade de capacidade da Magia.'>Espaços</th>
									<th title='Define se a Magia será visível para o jogador.'>Visível</th>
								</tr>
							</thead>
							<tbody>
								{spell.map((spell) => (
									<SpellEditorField key={spell.id} spell={spell} onDelete={deleteSpell} />
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateSpellModal
				show={showSpellModal}
				onHide={() => setShowSpellModal(false)}
				onCreate={createSpell}
			/>
		</>
	);
}

type SpellEditorFieldProps = {
	spell: Spell;
	onDelete(id: number): void;
};

function SpellEditorField({ spell, onDelete }: SpellEditorFieldProps) {
	const logError = useContext(ErrorLogger);
	const [lastName, name, setName] = useExtendedState(spell.name);
	const [lastDescription, description, setDescription] = useExtendedState(
		spell.description
	);
	const [lastCost, cost, setCost] = useExtendedState(spell.cost);
	const [lastType, type, setType] = useExtendedState(spell.type);
	const [lastTarget, target, setTarget] = useExtendedState(spell.target);
	const [lastDamage, damage, setDamage] = useExtendedState(spell.damage);
	const [lastCastingTime, castingTime, setCastingTime] = useExtendedState(
		spell.castingTime
	);
	const [lastRange, range, setRange] = useExtendedState(spell.range);
	const [lastDuration, duration, setDuration] = useExtendedState(spell.duration);
	const [lastSlots, slots, setSlots] = useExtendedState(spell.slots);
	const [visible, setVisible] = useState(spell.visible);

	function onNameBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/spell', { id: spell.id, name }).catch(logError);
	}

	function onTypeBlur() {
		if (type === lastType) return;
		setType(type);
		api.post('/sheet/spell', { id: spell.id, type }).catch(logError);
	}

	function onDescriptionBlur() {
		if (description === lastDescription) return;
		setDescription(description);
		api.post('/sheet/spell', { id: spell.id, description }).catch(logError);
	}

	function onCostBlur() {
		if (cost === lastCost) return;
		setCost(cost);
		api.post('/sheet/spell', { id: spell.id, cost }).catch(logError);
	}

	function onTargetBlur() {
		if (target === lastTarget) return;
		setTarget(target);
		api.post('/sheet/spell', { id: spell.id, target }).catch(logError);
	}

	function onDamageBlur() {
		if (damage === lastDamage) return;
		setDamage(damage);
		api.post('/sheet/spell', { id: spell.id, damage }).catch(logError);
	}

	function onCastingTimeBlur() {
		if (castingTime === lastCastingTime) return;
		setCastingTime(castingTime);
		api.post('/sheet/spell', { id: spell.id, castingTime }).catch(logError);
	}

	function onRangeBlur() {
		if (range === lastRange) return;
		setRange(range);
		api.post('/sheet/spell', { id: spell.id, range }).catch(logError);
	}

	function onDurationBlur() {
		if (duration === lastDuration) return;
		setDuration(duration);
		api.post('/sheet/spell', { id: spell.id, duration }).catch(logError);
	}

	function onSlotsChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newSlots = parseInt(aux);

		if (aux.length === 0) newSlots = 0;
		else if (isNaN(newSlots)) return;

		setSlots(newSlots);
	}

	function onSlotsBlur() {
		if (slots === lastSlots) return;
		setSlots(slots);
		api.post('/sheet/spell', { id: spell.id, slots }).catch(logError);
	}

	function onVisibleChange() {
		const newVisible = !visible;
		setVisible(newVisible);
		api.post('/sheet/spell', { id: spell.id, visible: newVisible }).catch((err) => {
			setVisible(visible);
			logError(err);
		});
	}

	return (
		<tr>
			<td>
				<Button onClick={() => onDelete(spell.id)} size='sm' variant='secondary'>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onNameBlur}
				/>
			</td>
			<td>
				<BottomTextInput
					value={description}
					onChange={(ev) => setDescription(ev.currentTarget.value)}
					onBlur={onDescriptionBlur}
				/>
			</td>
			<td>
				<BottomTextInput
					value={cost}
					onChange={(ev) => setCost(ev.currentTarget.value)}
					onBlur={onCostBlur}
					style={{ maxWidth: '5rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<BottomTextInput
					value={type}
					onChange={(ev) => setType(ev.currentTarget.value)}
					onBlur={onTypeBlur}
				/>
			</td>
			<td>
				<BottomTextInput
					value={damage}
					onChange={(ev) => setDamage(ev.currentTarget.value)}
					onBlur={onDamageBlur}
					style={{ maxWidth: '5rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<BottomTextInput
					value={target}
					onChange={(ev) => setTarget(ev.currentTarget.value)}
					onBlur={onTargetBlur}
					style={{ maxWidth: '6rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<BottomTextInput
					value={castingTime}
					onChange={(ev) => setCastingTime(ev.currentTarget.value)}
					onBlur={onCastingTimeBlur}
					style={{ maxWidth: '6rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<BottomTextInput
					value={range}
					onChange={(ev) => setRange(ev.currentTarget.value)}
					onBlur={onRangeBlur}
					style={{ maxWidth: '5rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<BottomTextInput
					value={duration}
					onChange={(ev) => setDuration(ev.currentTarget.value)}
					onBlur={onDurationBlur}
					style={{ maxWidth: '6rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<BottomTextInput
					value={slots}
					onChange={onSlotsChange}
					onBlur={onSlotsBlur}
					style={{ maxWidth: '6rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<FormCheck
					checked={visible}
					onChange={onVisibleChange}
					style={{ maxWidth: '3rem' }}
				/>
			</td>
		</tr>
	);
}
