import type { Equipment } from '@prisma/client';
import type { FormEvent } from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger, Socket } from '../../contexts';
import type { DiceRollEvent } from '../../hooks/useDiceRoll';
import useDiceRoll from '../../hooks/useDiceRoll';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import { resolveDices } from '../../utils/dice';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';
import DiceRollResultModal from '../Modals/DiceRollResultModal';

type PlayerEquipmentContainerProps = {
	playerEquipments: {
		currentAmmo: number;
		Equipment: {
			id: number;
			ammo: number | null;
			attacks: string;
			damage: string;
			name: string;
			range: string;
			type: string;
		};
	}[];
	availableEquipments: Equipment[];
	title: string;
};

export default function PlayerEquipmentContainer(props: PlayerEquipmentContainerProps) {
	const [diceRollResultModalProps, onDiceRoll] = useDiceRoll();
	const [addEquipmentShow, setAddEquipmentShow] = useState(false);
	const [availableEquipments, setAvailableEquipments] = useState<
		{ id: number; name: string }[]
	>(props.availableEquipments);
	const [playerEquipments, setPlayerEquipments] = useState(props.playerEquipments);
	const playerEquipmentsRef = useRef(playerEquipments);
	playerEquipmentsRef.current = playerEquipments;
	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	useEffect(() => {
		if (!socket) return;

		socket.on('playerEquipmentAdd', (id, name) => {
			setAvailableEquipments((equipments) => {
				if (
					equipments.findIndex((eq) => eq.id === id) > -1 ||
					playerEquipmentsRef.current.findIndex((eq) => eq.Equipment.id === id) > -1
				)
					return equipments;
				return [...equipments, { id, name }];
			});
		});

		socket.on('playerEquipmentRemove', (id, hardRemove) => {
			if (hardRemove) {
				setPlayerEquipments((playerEquipments) => {
					const index = playerEquipments.findIndex((eq) => eq.Equipment.id === id);
					if (index === -1) return playerEquipments;
					const newEquipments = [...playerEquipments];
					newEquipments.slice(index, 1);
					return newEquipments;
				});
			}
			setAvailableEquipments((equipments) => {
				const index = equipments.findIndex((eq) => eq.id === id);
				if (index === -1) return equipments;
				const newEquipments = [...equipments];
				newEquipments.splice(index, 1);
				return newEquipments;
			});
		});

		socket.on('playerEquipmentChange', (id, equip) => {
			setPlayerEquipments((equipments) => {
				const index = equipments.findIndex((eq) => eq.Equipment.id === id);
				if (index === -1) return equipments;
				const newEquipments = [...equipments];
				newEquipments[index].Equipment = equip;
				return newEquipments;
			});

			setAvailableEquipments((equipments) => {
				const index = equipments.findIndex((eq) => eq.id === id);
				if (index === -1) return equipments;
				const newEquipments = [...equipments];
				newEquipments[index].name = equip.name;
				return newEquipments;
			});
		});

		return () => {
			socket.off('playerEquipmentAdd');
			socket.off('playerEquipmentRemove');
			socket.off('playerEquipmentChange');
		};
	}, [socket]);

	function onAddEquipment(id: number) {
		api
			.put('/sheet/player/equipment', { id })
			.then((res) => {
				const equipment = res.data.equipment;
				setPlayerEquipments([...playerEquipments, equipment]);

				const newEquipments = [...availableEquipments];
				newEquipments.splice(
					newEquipments.findIndex((eq) => eq.id === id),
					1
				);
				setAvailableEquipments(newEquipments);
			})
			.catch(logError);
	}

	function onDeleteEquipment(id: number) {
		const newPlayerEquipments = [...playerEquipments];
		const index = newPlayerEquipments.findIndex((eq) => eq.Equipment.id === id);

		if (index === -1) return;

		newPlayerEquipments.splice(index, 1);
		setPlayerEquipments(newPlayerEquipments);

		const modalEquipment = { id, name: playerEquipments[index].Equipment.name };
		setAvailableEquipments([...availableEquipments, modalEquipment]);
	}

	const equipments = useMemo(
		() => playerEquipments.sort((a, b) => a.Equipment.id - b.Equipment.id),
		[playerEquipments]
	);

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setAddEquipmentShow(true) }}>
				<Row className='mb-3 text-center'>
					<Col>
						<Table responsive className='align-middle'>
							<thead>
								<tr>
									<th></th>
									<th>Nome</th>
									<th>Tipo</th>
									<th>Dano</th>
									<th></th>
									<th>Alcance</th>
									<th>Ataques</th>
									<th>Mun. Atual</th>
									<th>Mun. Máxima</th>
								</tr>
							</thead>
							<tbody>
								{equipments.map((eq) => (
									<PlayerEquipmentField
										key={eq.Equipment.id}
										equipment={eq.Equipment}
										currentAmmo={eq.currentAmmo}
										onDelete={onDeleteEquipment}
										showDiceRollResult={onDiceRoll}
									/>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
			</DataContainer>
			<AddDataModal
				title={`Adicionar em ${props.title}`}
				show={addEquipmentShow}
				onHide={() => setAddEquipmentShow(false)}
				data={availableEquipments}
				onAddData={onAddEquipment}
			/>
			<DiceRollResultModal {...diceRollResultModalProps} />
		</>
	);
}

type PlayerEquipmentFieldProps = {
	currentAmmo: number;
	equipment: {
		id: number;
		ammo: number | null;
		attacks: string;
		damage: string;
		name: string;
		range: string;
		type: string;
	};
	onDelete(id: number): void;
	showDiceRollResult: DiceRollEvent;
};

function PlayerEquipmentField(props: PlayerEquipmentFieldProps) {
	const [lastAmmo, currentAmmo, setCurrentAmmo] = useExtendedState(props.currentAmmo);
	const [loading, setLoading] = useState(false);

	const logError = useContext(ErrorLogger);
	const equipmentID = props.equipment.id;

	function onAmmoChange(ev: FormEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newAmmo = parseInt(aux);

		if (aux.length === 0) newAmmo = 0;
		else if (isNaN(newAmmo)) return;

		setCurrentAmmo(newAmmo);
	}

	function onAmmoBlur() {
		if (currentAmmo === lastAmmo) return;
		setCurrentAmmo(currentAmmo);
		api.post('/sheet/player/equipment', { id: equipmentID, currentAmmo }).catch(logError);
	}

	function diceRoll() {
		if (props.equipment.ammo && currentAmmo === 0)
			return alert('Você não tem munição suficiente.');
		const aux = resolveDices(props.equipment.damage);
		if (!aux) return;
		props.showDiceRollResult(aux);
		const ammo = currentAmmo - 1;
		setCurrentAmmo(ammo);
		api
			.post('/sheet/player/equipment', { id: equipmentID, currentAmmo: ammo })
			.catch((err) => {
				logError(err);
				setCurrentAmmo(currentAmmo);
			});
	}

	function deleteEquipment() {
		if (!confirm('Você realmente deseja excluir esse equipamento?')) return;
		setLoading(true);
		api
			.delete('/sheet/player/equipment', {
				data: { id: equipmentID },
			})
			.then(() => props.onDelete(equipmentID))
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<tr>
			<td>
				<Button
					onClick={deleteEquipment}
					size='sm'
					variant='secondary'
					disabled={loading}>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>{props.equipment.name}</td>
			<td>{props.equipment.type}</td>
			<td>{props.equipment.damage}</td>
			<td>
				<Image
					alt='Dado'
					src='/dice20.png'
					className='clickable'
					onClick={diceRoll}
					style={{ maxHeight: '2rem' }}
				/>
			</td>
			<td>{props.equipment.range}</td>
			<td>{props.equipment.attacks}</td>
			<td>
				{props.equipment.ammo ? (
					<BottomTextInput
						className='text-center'
						value={currentAmmo}
						onChange={onAmmoChange}
						onBlur={onAmmoBlur}
						style={{ maxWidth: '3rem' }}
					/>
				) : (
					'-'
				)}
			</td>
			<td>{props.equipment.ammo || '-'}</td>
		</tr>
	);
}
