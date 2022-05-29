import type {
	Attribute,
	AttributeStatus,
	Currency,
	Equipment,
	Item,
	Spec,
} from '@prisma/client';
import { Reducer, useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import AvatarField from './AvatarField';
import PlayerPortraitButton from './PlayerPortraitButton';

type Player = {
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
	PlayerItem: {
		Item: {
			id: number;
			name: string;
			description: string;
			weight: number;
		};
		currentDescription: string;
		quantity: number;
	}[];
	PlayerCurrency: {
		value: string;
		Currency: Currency;
	}[];
};

type PlayerManagerActions = {
	delete: { playerId: number };
	updateAttributeStatus: { playerId: number; id: number; value: boolean };
	updateName: { playerId: number; value: string };
	updateAttribute: {
		playerId: number;
		id: number;
		value: number | null;
		maxValue: number | null;
	};
	updateSpec: { playerId: number; id: number; value: string };
	updateCurrency: { playerId: number; id: number; value: string };
	addEquipment: { playerId: number; equipment: Equipment };
	removeEquipment: { playerId: number; id: number };
	addItem: { playerId: number; item: Item; description: string; quantity: number };
	removeItem: { playerId: number; id: number };
	updateItem: {
		playerId: number;
		id: number;
		description: string | null;
		quantity: number | null;
	};
	updateMaxLoad: { playerId: number; value: number };
};

const PlayerManagerReducer: Reducer<Player[], ReducerActions<PlayerManagerActions>> = (
	players,
	{ type, data }
) => {
	const playerIndex = players.findIndex((p) => p.id === data.playerId);

	if (playerIndex === -1) return players;

	switch (type) {
		case 'delete':
			players.splice(playerIndex, 1);
			break;
		case 'updateAttributeStatus': {
			const stat = players[playerIndex].PlayerAttributeStatus.find(
				(s) => s.AttributeStatus.id === data.id
			);
			if (stat) stat.value = data.value;
			break;
		}
		case 'updateName':
			players[playerIndex].name = data.value;
			break;
		case 'updateAttribute': {
			const attr = players[playerIndex].PlayerAttributes.find(
				(a) => a.Attribute.id === data.id
			);
			if (attr) {
				if (data.value) attr.value = data.value;
				if (data.maxValue) attr.maxValue = data.maxValue;
			}
			break;
		}
		case 'updateSpec': {
			const spec = players[playerIndex].PlayerSpec.find((s) => s.Spec.id === data.id);
			if (spec) spec.value = data.value;
			break;
		}
		case 'updateCurrency': {
			const cur = players[playerIndex].PlayerCurrency.find(
				(c) => c.Currency.id === data.id
			);
			if (cur) cur.value = data.value;
			break;
		}
		case 'addEquipment':
			players[playerIndex].PlayerEquipment.push({ Equipment: data.equipment });
			break;
		case 'removeEquipment': {
			const eq = players[playerIndex].PlayerEquipment;
			eq.splice(
				eq.findIndex((_eq) => _eq.Equipment.id === data.id),
				1
			);
			break;
		}
		case 'addItem':
			players[playerIndex].PlayerItem.push({
				Item: data.item,
				currentDescription: data.description,
				quantity: data.quantity,
			});
			break;
		case 'removeItem': {
			const it = players[playerIndex].PlayerItem;
			it.splice(
				it.findIndex((_it) => _it.Item.id === data.id),
				1
			);
			break;
		}
		case 'updateItem': {
			let it = players[playerIndex].PlayerItem.find((_it) => _it.Item.id === data.id);
			if (it) {
				if (data.description) it.currentDescription = data.description;
				if (data.quantity) it.quantity = data.quantity;
			}
			break;
		}
	}
	return [...players];
};

type PlayerManagerProps = {
	players: Player[];
};

export default function PlayerManager(props: PlayerManagerProps) {
	const [players, dispatch] = useReducer(PlayerManagerReducer, props.players);
	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	function onDeletePlayer(id: number) {
		if (!confirm('Tem certeza que deseja apagar esse jogador?')) return;
		api
			.delete('/sheet/player', { data: { id } })
			.then(() => dispatch({ type: 'delete', data: { playerId: id } }))
			.catch(logError);
	}

	useEffect(() => {
		socket.on('playerAttributeStatusChange', (playerId, id, value) =>
			dispatch({ type: 'updateAttributeStatus', data: { playerId, id, value } })
		);
		socket.on('playerNameChange', (playerId, value) =>
			dispatch({ type: 'updateName', data: { playerId, value } })
		);
		socket.on('playerAttributeChange', (playerId, id, value, maxValue) =>
			dispatch({ type: 'updateAttribute', data: { playerId, id, value, maxValue } })
		);
		socket.on('playerSpecChange', (playerId, id, value) =>
			dispatch({ type: 'updateSpec', data: { playerId, id, value } })
		);
		socket.on('playerCurrencyChange', (playerId, id, value) =>
			dispatch({ type: 'updateCurrency', data: { playerId, id, value } })
		);
		socket.on('playerEquipmentAdd', (playerId, equipment) =>
			dispatch({ type: 'addEquipment', data: { playerId, equipment } })
		);
		socket.on('playerEquipmentRemove', (playerId, id) =>
			dispatch({ type: 'removeEquipment', data: { playerId, id } })
		);
		socket.on('playerItemAdd', (playerId, item, description, quantity) =>
			dispatch({ type: 'addItem', data: { playerId, item, description, quantity } })
		);
		socket.on('playerItemRemove', (playerId, id) =>
			dispatch({ type: 'removeItem', data: { playerId, id } })
		);
		socket.on('playerItemChange', (playerId, id, description, quantity) =>
			dispatch({ type: 'updateItem', data: { playerId, id, description, quantity } })
		);
		socket.on('playerMaxLoadChange', (playerId, value) =>
			dispatch({ type: 'updateMaxLoad', data: { playerId, value } })
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

function ItemHeader({
	playerItem,
	maxLoad,
}: {
	playerItem: { Item: { weight: number }; quantity: number }[];
	maxLoad: number;
}) {
	const load = playerItem.reduce((prev, cur) => prev + cur.Item.weight * cur.quantity, 0);
	return (
		<>
			Peso Atual:{' '}
			<span style={{ color: load > maxLoad ? 'red' : '' }}>
				{load}/{maxLoad}
			</span>
		</>
	);
}
