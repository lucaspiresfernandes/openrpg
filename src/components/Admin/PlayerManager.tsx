import type {
	Attribute,
	AttributeStatus,
	Currency,
	Equipment,
	Spec,
} from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import type {
	PlayerAttributeChangeEvent,
	PlayerAttributeStatusChangeEvent,
	PlayerCurrencyChangeEvent,
	PlayerEquipmentAddEvent,
	PlayerEquipmentRemoveEvent,
	PlayerItemAddEvent,
	PlayerItemChangeEvent,
	PlayerItemRemoveEvent,
	PlayerMaxLoadChangeEvent,
	PlayerNameChangeEvent,
	PlayerSpecChangeEvent,
} from '../../utils/socket';
import AvatarField from './AvatarField';
import PlayerPortraitButton from './PlayerPortraitButton';

type PlayerItem = {
	Item: {
		id: number;
		name: string;
		description: string;
		weight: number;
	};
	currentDescription: string;
	quantity: number;
};

type PlayerManagerProps = {
	players: {
		id: number;
		name: string;
		maxLoad: number;
		PlayerAttributeStatus: {
			AttributeStatus: AttributeStatus;
			value: boolean;
		}[];
		PlayerAttributes: {
			Attribute: Attribute;
			value: number;
			maxValue: number;
		}[];
		PlayerSpec: {
			Spec: Spec;
			value: string;
		}[];
		PlayerEquipment: { Equipment: Equipment }[];
		PlayerItem: PlayerItem[];
		PlayerCurrency: {
			value: string;
			Currency: Currency;
		}[];
	}[];
};

export default function PlayerManager({ players: _players }: PlayerManagerProps) {
	const [players, setPlayers] = useState(_players);
	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	function onDeletePlayer(id: number) {
		if (!confirm('Tem certeza que deseja apagar esse jogador?')) return;
		api
			.delete('/sheet/player', { data: { id } })
			.then(() => {
				const newPlayers = [...players];
				newPlayers.splice(
					players.findIndex((p) => p.id === id),
					1
				);
				setPlayers(newPlayers);
			})
			.catch(logError);
	}

	const socket_playerAttributeStatusChange = useRef<PlayerAttributeStatusChangeEvent>(
		() => {}
	);
	const socket_playerNameChange = useRef<PlayerNameChangeEvent>(() => {});
	const socket_playerAttributeChange = useRef<PlayerAttributeChangeEvent>(() => {});
	const socket_playerSpecChange = useRef<PlayerSpecChangeEvent>(() => {});
	const socket_playerCurrencyChange = useRef<PlayerCurrencyChangeEvent>(() => {});
	const socket_playerEquipmentAdd = useRef<PlayerEquipmentAddEvent>(() => {});
	const socket_playerEquipmentRemove = useRef<PlayerEquipmentRemoveEvent>(() => {});
	const socket_playerItemAdd = useRef<PlayerItemAddEvent>(() => {});
	const socket_playerItemRemove = useRef<PlayerItemRemoveEvent>(() => {});
	const socket_playerItemChange = useRef<PlayerItemChangeEvent>(() => {});
	const socket_playerMaxLoadChange = useRef<PlayerMaxLoadChangeEvent>(() => {});

	useEffect(() => {
		socket_playerAttributeStatusChange.current = (playerId, id, value) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerAttributeStatus.findIndex(
				(curr) => curr.AttributeStatus.id === id
			);
			if (index === -1) return;

			player.PlayerAttributeStatus[index].value = value;
			setPlayers([...players]);
		};

		socket_playerNameChange.current = (playerId, value) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			player.name = value;

			setPlayers([...players]);
		};

		socket_playerAttributeChange.current = (playerId, id, value, maxValue) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerAttributes.findIndex((curr) => curr.Attribute.id === id);
			if (index === -1 || (value === null && maxValue === null)) return;

			if (value !== null) player.PlayerAttributes[index].value = value;
			if (maxValue !== null) player.PlayerAttributes[index].maxValue = maxValue;

			setPlayers([...players]);
		};

		socket_playerSpecChange.current = (playerId, id, value) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerSpec.findIndex(
				(curr) => curr.Spec.id === id
			);
			if (index === -1) return;

			player.PlayerSpec[index].value = value;
			setPlayers([...players]);
		};

		socket_playerCurrencyChange.current = (playerId, id, value) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerCurrency.findIndex(
				(curr) => curr.Currency.id === id
			);
			if (index === -1) return;

			player.PlayerCurrency[index].value = value;
			setPlayers([...players]);
		};

		socket_playerEquipmentAdd.current = (playerId, equipment) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			player.PlayerEquipment = [...player.PlayerEquipment, { Equipment: equipment }];

			setPlayers([...players]);
		};

		socket_playerEquipmentRemove.current = (playerId, id) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerEquipment.findIndex((it) => it.Equipment.id === id);
			if (index === -1) return;

			player.PlayerEquipment.splice(index, 1);

			setPlayers([...players]);
		};

		socket_playerItemAdd.current = (playerId, item, currentDescription, quantity) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			player.PlayerItem = [
				...player.PlayerItem,
				{ Item: item, currentDescription, quantity },
			];

			setPlayers([...players]);
		};

		socket_playerItemRemove.current = (playerId, id) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerItem.findIndex((it) => it.Item.id === id);
			if (index === -1) return;

			player.PlayerItem.splice(index, 1);

			setPlayers([...players]);
		};

		socket_playerItemChange.current = (playerId, id, currentDescription, quantity) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			const index = player.PlayerItem.findIndex((it) => it.Item.id === id);
			if (index === -1) return;

			if (currentDescription !== null)
				player.PlayerItem[index].currentDescription = currentDescription;
			if (quantity !== null) player.PlayerItem[index].quantity = quantity;

			setPlayers([...players]);
		};

		socket_playerMaxLoadChange.current = (playerId, newLoad) => {
			const player = players.find((p) => p.id === playerId);
			if (!player) return;

			player.maxLoad = newLoad;

			setPlayers([...players]);
		};
	});

	useEffect(() => {
		socket.on('playerAttributeStatusChange', (playerId, attrStatusID, value) =>
			socket_playerAttributeStatusChange.current(playerId, attrStatusID, value)
		);
		socket.on('playerNameChange', (playerId, value) =>
			socket_playerNameChange.current(playerId, value)
		);
		socket.on('playerAttributeChange', (playerId, attributeID, value, maxValue, show) =>
			socket_playerAttributeChange.current(playerId, attributeID, value, maxValue, show)
		);
		socket.on('playerSpecChange', (playerId, specID, value) =>
			socket_playerSpecChange.current(playerId, specID, value)
		);
		socket.on('playerCurrencyChange', (playerId, currencyId, value) =>
			socket_playerCurrencyChange.current(playerId, currencyId, value)
		);
		socket.on('playerEquipmentAdd', (playerId, equipment) =>
			socket_playerEquipmentAdd.current(playerId, equipment)
		);
		socket.on('playerEquipmentRemove', (playerId, equipID) =>
			socket_playerEquipmentRemove.current(playerId, equipID)
		);
		socket.on('playerItemAdd', (playerId, item, currentDescription, quantity) =>
			socket_playerItemAdd.current(playerId, item, currentDescription, quantity)
		);
		socket.on('playerItemRemove', (playerId, itemID) =>
			socket_playerItemRemove.current(playerId, itemID)
		);
		socket.on('playerItemChange', (playerId, itemID, currentDescription, quantity) =>
			socket_playerItemChange.current(playerId, itemID, currentDescription, quantity)
		);
		socket.on('playerMaxLoadChange', (playerId, newLoad) =>
			socket_playerMaxLoadChange.current(playerId, newLoad)
		);

		return () => {
			socket.off('playerAttributeStatusChange');
			socket.off('playerNameChange');
			socket.off('playerAttributeChange');
			socket.off('playerSpecChange');
			socket.off('playerCurrencyChange');
			socket.off('playerEquipmentAdd');
			socket.off('playerEquipmentRemove');
			socket.off('playerItemAdd');
			socket.off('playerItemRemove');
			socket.off('playerItemChange');
			socket.off('playerMaxLoadChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (players.length === 0)
		return (
			<Col className='h2 text-center' style={{ color: 'gray' }}>
				Não há nenhum jogador cadastrado.
			</Col>
		);

	function ItemHeader({
		playerItem,
		maxLoad,
	}: {
		playerItem: PlayerItem[];
		maxLoad: number;
	}) {
		const load = playerItem.reduce(
			(prev, cur) => prev + cur.Item.weight * cur.quantity,
			0
		);
		return (
			<>
				Peso Atual:{' '}
				<span style={{ color: load > maxLoad ? 'red' : '' }}>
					{load}/{maxLoad}
				</span>
			</>
		);
	}

	return (
		<>
			{players.map((player) => (
				<Col key={player.id} xs={12} md={6} xl={4} className='h-100 my-2'>
					<Row className='player-container text-center'>
						<Col>
							<Row className='my-2'>
								<Col>
									<Button
										size='sm'
										variant='secondary'
										onClick={() => onDeletePlayer(player.id)}>
										Apagar
									</Button>
								</Col>
								<Col>
									<PlayerPortraitButton playerId={player.id} />
								</Col>
							</Row>
							<AvatarField
								playerId={player.id}
								status={player.PlayerAttributeStatus.map((stat) => {
									return { id: stat.AttributeStatus.id, value: stat.value };
								})}
							/>
							<Row className='mt-2'>
								<Col>
									<Row>
										<Col className='h5'>{player.name || 'Desconhecido'}</Col>
									</Row>
								</Col>
							</Row>
							<hr />
							<Row>
								{player.PlayerAttributes.map((attr) => (
									<Col key={attr.Attribute.id}>
										<Row>
											<Col className='h5' style={{ color: `#${attr.Attribute.color}` }}>
												{attr.value}/{attr.maxValue}
											</Col>
										</Row>
										<Row>
											<Col>{attr.Attribute.name}</Col>
										</Row>
									</Col>
								))}
							</Row>
							<hr />
							<Row>
								{player.PlayerSpec.map((spec) => (
									<Col key={spec.Spec.id}>
										<Row>
											<Col className='h5'>{spec.value || '0'}</Col>
										</Row>
										<Row>
											<Col>{spec.Spec.name}</Col>
										</Row>
									</Col>
								))}
							</Row>
							<hr />
							<Row>
								{player.PlayerCurrency.map((curr) => (
									<Col key={curr.Currency.id}>
										<Row>
											<Col className='h5'>{curr.value || '0'}</Col>
										</Row>
										<Row>
											<Col>{curr.Currency.name}</Col>
										</Row>
									</Col>
								))}
							</Row>
							<hr />
							<Row>
								<Col className='h3'>Equipamentos</Col>
							</Row>
							<Row className='mb-3'>
								<Col>
									<Table responsive>
										<thead>
											<tr>
												<th>Nome</th>
												<th>Dano</th>
												<th>Tipo</th>
												<th>Alcance</th>
												<th>Ataques</th>
											</tr>
										</thead>
										<tbody>
											{player.PlayerEquipment.map((equip) => (
												<tr key={equip.Equipment.id}>
													<td>{equip.Equipment.name}</td>
													<td>{equip.Equipment.damage}</td>
													<td>{equip.Equipment.type}</td>
													<td>{equip.Equipment.range}</td>
													<td>{equip.Equipment.attacks}</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Col>
							</Row>
							<Row>
								<Col className='h3'>Inventário</Col>
							</Row>
							<Row className='mb-2 h6'>
								<Col>
									<ItemHeader playerItem={player.PlayerItem} maxLoad={player.maxLoad} />
								</Col>
							</Row>
							<Row className='mb-2'>
								<Col>
									{player.PlayerItem.map((item) => (
										<Row key={item.Item.id} className='mb-2'>
											<Col
												title={`${item.currentDescription} (Peso: ${item.Item.weight})`}>
												{item.Item.name} ({item.quantity})
											</Col>
										</Row>
									))}
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			))}
		</>
	);
}
