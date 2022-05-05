import type { Equipment } from '@prisma/client';
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
import CustomSpinner from '../../CustomSpinner';
import DataContainer from '../../DataContainer';
import CreateEquipmentModal from '../../Modals/CreateEquipmentModal';
import AdminTable from '../AdminTable';

type EquipmentEditorContainerProps = {
	equipments: Equipment[];
	title: string;
};

export default function EquipmentEditorContainer(props: EquipmentEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [showEquipmentModal, setShowEquipmentModal] = useState(false);
	const [equipment, setEquipment] = useState(props.equipments);
	const logError = useContext(ErrorLogger);

	function createEquipment(
		name: string,
		type: string,
		damage: string,
		range: string,
		attacks: string,
		ammo: number | null = null
	) {
		setLoading(true);
		api
			.put('/sheet/equipment', { name, type, damage, range, attacks, ammo })
			.then((res) => {
				const id = res.data.id;
				setEquipment([
					...equipment,
					{ id, name, type, damage, range, attacks, ammo, visible: true },
				]);
			})
			.catch(logError)
			.finally(() => {
				setShowEquipmentModal(false);
				setLoading(false);
			});
	}

	function deleteEquipment(id: number) {
		const newEquipment = [...equipment];
		const index = newEquipment.findIndex((eq) => eq.id === id);
		if (index > -1) {
			newEquipment.splice(index, 1);
			setEquipment(newEquipment);
		}
	}

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setShowEquipmentModal(true), disabled: loading }}>
				<Row>
					<Col>
						<AdminTable centerText>
							<thead>
								<tr>
									<th></th>
									<th title='Nome do Equipamento.'>Nome</th>
									<th title='Tipo do Equipamento.'>Tipo</th>
									<th title='Dano do Equipamento.'>Dano</th>
									<th title='Alcance, em metros, do Equipamento.'>Alcance</th>
									<th title='Números de ataques por round do Equipamento.'>Ataques</th>
									<th title='Munição total do Equipamento.'>Munição</th>
									<th title='Define se o Equipamento será visível para o jogador.'>
										Visível
									</th>
								</tr>
							</thead>
							<tbody>
								{equipment.map((equipment) => (
									<EquipmentEditorField
										key={equipment.id}
										equipment={equipment}
										onDelete={deleteEquipment}
									/>
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateEquipmentModal
				show={showEquipmentModal}
				onHide={() => setShowEquipmentModal(false)}
				onCreate={createEquipment}
				disabled={loading}
			/>
		</>
	);
}

type EquipmentEditorFieldProps = {
	equipment: Equipment;
	onDelete(id: number): void;
};

function EquipmentEditorField(props: EquipmentEditorFieldProps) {
	const [loading, setLoading] = useState(false);
	const [lastName, name, setName] = useExtendedState(props.equipment.name);
	const [lastType, type, setType] = useExtendedState(props.equipment.type);
	const [lastDamage, damage, setDamage] = useExtendedState(props.equipment.damage);
	const [lastRange, range, setRange] = useExtendedState(props.equipment.range);
	const [lastAttacks, attacks, setAttacks] = useExtendedState(props.equipment.attacks);
	const [lastAmmo, ammo, setAmmo] = useExtendedState(props.equipment.ammo);
	const [visible, setVisible] = useState(props.equipment.visible);

	const logError = useContext(ErrorLogger);

	function onNameBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/equipment', { id: props.equipment.id, name }).catch(logError);
	}

	function onTypeBlur() {
		if (type === lastType) return;
		setType(type);
		api.post('/sheet/equipment', { id: props.equipment.id, type }).catch(logError);
	}

	function onDamageBlur() {
		if (damage === lastDamage) return;
		setDamage(damage);
		api.post('/sheet/equipment', { id: props.equipment.id, damage }).catch(logError);
	}

	function onRangeBlur() {
		if (range === lastRange) return;
		setRange(range);
		api.post('/sheet/equipment', { id: props.equipment.id, range }).catch(logError);
	}

	function onAttacksBlur() {
		if (attacks === lastAttacks) return;
		setAttacks(attacks);
		api.post('/sheet/equipment', { id: props.equipment.id, attacks }).catch(logError);
	}

	function onAmmoChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newAmmo = parseInt(aux);

		if (aux.length === 0) newAmmo = 0;
		else if (isNaN(newAmmo)) return;

		setAmmo(newAmmo);
	}

	function onAmmoBlur() {
		if (ammo === lastAmmo) return;
		setAmmo(ammo);
		api.post('/sheet/equipment', { id: props.equipment.id, ammo }).catch(logError);
	}

	function onVisibleChange() {
		const newVisible = !visible;
		setVisible(newVisible);
		api
			.post('/sheet/equipment', { id: props.equipment.id, visible: newVisible })
			.catch((err) => {
				setVisible(visible);
				logError(err);
			});
	}

	function onDelete() {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/equipment', { data: { id: props.equipment.id } })
			.then(() => props.onDelete(props.equipment.id))
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<tr>
			<td>
				<Button onClick={onDelete} size='sm' variant='secondary' disabled={loading}>
					{loading ? <CustomSpinner /> : <BsTrash color='white' size='1.5rem' />}
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onNameBlur}
					disabled={loading}
				/>
			</td>
			<td>
				<BottomTextInput
					value={type}
					onChange={(ev) => setType(ev.currentTarget.value)}
					onBlur={onTypeBlur}
					disabled={loading}
				/>
			</td>
			<td>
				<BottomTextInput
					value={damage}
					onChange={(ev) => setDamage(ev.currentTarget.value)}
					onBlur={onDamageBlur}
					className='text-center'
					style={{ maxWidth: '7.5rem' }}
					disabled={loading}
				/>
			</td>
			<td>
				<BottomTextInput
					value={range}
					onChange={(ev) => setRange(ev.currentTarget.value)}
					onBlur={onRangeBlur}
					className='text-center'
					style={{ maxWidth: '7.5rem' }}
					disabled={loading}
				/>
			</td>
			<td>
				<BottomTextInput
					value={attacks}
					onChange={(ev) => setAttacks(ev.currentTarget.value)}
					onBlur={onAttacksBlur}
					className='text-center'
					style={{ maxWidth: '5rem' }}
					disabled={loading}
				/>
			</td>
			<td>
				{ammo === null ? (
					'-'
				) : (
					<BottomTextInput
						value={ammo}
						onChange={onAmmoChange}
						onBlur={onAmmoBlur}
						style={{ maxWidth: '3rem' }}
						className='text-center'
						disabled={loading}
					/>
				)}
			</td>
			<td>
				<FormCheck checked={visible} onChange={onVisibleChange} disabled={loading} />
			</td>
		</tr>
	);
}
