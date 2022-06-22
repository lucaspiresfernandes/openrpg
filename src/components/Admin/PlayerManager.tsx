import type {
	Attribute,
	AttributeStatus,
	Characteristic,
	Currency,
	Equipment,
	Info,
	Skill,
	Spec,
	Spell,
} from '@prisma/client';
import { Reducer, useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import type {
	PlayerAttributeChangeEvent,
	PlayerAttributeStatusChangeEvent,
	PlayerCharacteristicChangeEvent,
	PlayerCurrencyChangeEvent,
	PlayerEquipmentAddEvent,
	PlayerEquipmentRemoveEvent,
	PlayerInfoChangeEvent,
	PlayerItemAddEvent,
	PlayerItemChangeEvent,
	PlayerItemRemoveEvent,
	PlayerMaxLoadChangeEvent,
	PlayerNameChangeEvent,
	PlayerSkillChangeEvent,
	PlayerSpecChangeEvent,
	PlayerSpellAddEvent,
	PlayerSpellRemoveEvent,
	PlayerSpellSlotsChangeEvent,
} from '../../utils/socket';
import AvatarField from './AvatarField';
import PlayerPortraitButton from './PlayerPortraitButton';

type Player = {
	id: number;
	name: string;
	maxLoad: number;
	spellSlots: number;
	PlayerInfo: {
		Info: Info;
		value: string;
	}[];
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
	PlayerCurrency: {
		value: string;
		Currency: Currency;
	}[];
	PlayerCharacteristic: {
		Characteristic: Characteristic;
		value: number;
		modifier: number;
	}[];
	PlayerSkill: {
		Skill: Skill;
		value: number;
		modifier: number;
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
	PlayerSpell: {
		Spell: Spell;
	}[];
};

type PlayerManagerActions = {
	delete: [playerId: number];
	updateAttributeStatus: Parameters<PlayerAttributeStatusChangeEvent>;
	updateName: Parameters<PlayerNameChangeEvent>;
	updateInfo: Parameters<PlayerInfoChangeEvent>;
	updateAttribute: Parameters<PlayerAttributeChangeEvent>;
	updateSpec: Parameters<PlayerSpecChangeEvent>;
	updateCurrency: Parameters<PlayerCurrencyChangeEvent>;
	updateCharacteristic: Parameters<PlayerCharacteristicChangeEvent>;
	updateSkill: Parameters<PlayerSkillChangeEvent>;
	addEquipment: Parameters<PlayerEquipmentAddEvent>;
	removeEquipment: Parameters<PlayerEquipmentRemoveEvent>;
	addItem: Parameters<PlayerItemAddEvent>;
	removeItem: Parameters<PlayerItemRemoveEvent>;
	updateItem: Parameters<PlayerItemChangeEvent>;
	addSpell: Parameters<PlayerSpellAddEvent>;
	removeSpell: Parameters<PlayerSpellRemoveEvent>;
	updateMaxLoad: Parameters<PlayerMaxLoadChangeEvent>;
	updateSpellSlots: Parameters<PlayerSpellSlotsChangeEvent>;
};

const PlayerManagerReducer: Reducer<Player[], ReducerActions<PlayerManagerActions>> = (
	players,
	action
) => {
	const playerIndex = players.findIndex((p) => p.id === action.data[0]);

	if (playerIndex === -1) return players;

	switch (action.type) {
		case 'delete':
			players.splice(playerIndex, 1);
			break;
		case 'updateAttributeStatus': {
			const stat = players[playerIndex].PlayerAttributeStatus.find(
				(s) => s.AttributeStatus.id === action.data[1]
			);
			if (stat) stat.value = action.data[2];
			break;
		}
		case 'updateName':
			players[playerIndex].name = action.data[1];
			break;
		case 'updateInfo':
			const info = players[playerIndex].PlayerInfo.find(
				(i) => i.Info.id === action.data[1]
			);
			if (info) {
				info.value = action.data[2];
			}
			break;
		case 'updateAttribute': {
			const attr = players[playerIndex].PlayerAttributes.find(
				(a) => a.Attribute.id === action.data[1]
			);
			if (attr) {
				attr.value = action.data[2];
				attr.maxValue = action.data[3];
			}
			break;
		}
		case 'updateSpec': {
			const spec = players[playerIndex].PlayerSpec.find(
				(s) => s.Spec.id === action.data[1]
			);
			if (spec) spec.value = action.data[2];
			break;
		}
		case 'updateCurrency': {
			const cur = players[playerIndex].PlayerCurrency.find(
				(c) => c.Currency.id === action.data[1]
			);
			if (cur) cur.value = action.data[2];
			break;
		}
		case 'updateCharacteristic': {
			const char = players[playerIndex].PlayerCharacteristic.find(
				(s) => s.Characteristic.id === action.data[1]
			);
			if (char) {
				char.value = action.data[2];
				char.modifier = action.data[3];
			}
			break;
		}
		case 'updateSkill': {
			const skill = players[playerIndex].PlayerSkill.find(
				(s) => s.Skill.id === action.data[1]
			);
			if (skill) {
				skill.value = action.data[2];
				skill.modifier = action.data[3];
			}
			break;
		}
		case 'updateSpec': {
			const spec = players[playerIndex].PlayerSpec.find(
				(s) => s.Spec.id === action.data[1]
			);
			if (spec) spec.value = action.data[2];
			break;
		}
		case 'addEquipment':
			players[playerIndex].PlayerEquipment.push({ Equipment: action.data[1] });
			break;
		case 'removeEquipment': {
			const eq = players[playerIndex].PlayerEquipment;
			eq.splice(
				eq.findIndex((_eq) => _eq.Equipment.id === action.data[1]),
				1
			);
			break;
		}
		case 'addItem':
			players[playerIndex].PlayerItem.push({
				Item: action.data[1],
				currentDescription: action.data[2],
				quantity: action.data[3],
			});
			break;
		case 'removeItem': {
			const it = players[playerIndex].PlayerItem;
			it.splice(
				it.findIndex((_it) => _it.Item.id === action.data[1]),
				1
			);
			break;
		}
		case 'updateItem': {
			let it = players[playerIndex].PlayerItem.find(
				(_it) => _it.Item.id === action.data[1]
			);
			if (it) {
				it.currentDescription = action.data[2];
				it.quantity = action.data[3];
			}
			break;
		}
		case 'addSpell':
			players[playerIndex].PlayerSpell.push({ Spell: action.data[1] });
			break;
		case 'removeSpell': {
			const eq = players[playerIndex].PlayerSpell;
			eq.splice(
				eq.findIndex((_eq) => _eq.Spell.id === action.data[1]),
				1
			);
			break;
		}
		case 'updateMaxLoad':
			players[playerIndex].maxLoad = action.data[1];
			break;
		case 'updateSpellSlots':
			players[playerIndex].spellSlots = action.data[1];
			break;
	}
	return [...players];
};

type PlayerManagerProps = {
	players: Player[];
	characteristicModifierEnabled: boolean;
	skillModifierEnabled: boolean;
};

export default function PlayerManager(props: PlayerManagerProps) {
	const [players, dispatch] = useReducer(PlayerManagerReducer, props.players);
	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	function onDeletePlayer(id: number) {
		if (!confirm('Tem certeza que deseja apagar esse jogador?')) return;
		api
			.delete('/sheet/player', { data: { id } })
			.then(() => dispatch({ type: 'delete', data: [id] }))
			.catch(logError);
	}

	useEffect(() => {
		socket.on('playerAttributeStatusChange', (playerId, id, value) =>
			dispatch({ type: 'updateAttributeStatus', data: [playerId, id, value] })
		);
		socket.on('playerNameChange', (playerId, value) =>
			dispatch({ type: 'updateName', data: [playerId, value] })
		);
		socket.on('playerInfoChange', (playerId, infoId, value) =>
			dispatch({ type: 'updateInfo', data: [playerId, infoId, value] })
		);
		socket.on('playerAttributeChange', (playerId, id, value, maxValue) =>
			dispatch({ type: 'updateAttribute', data: [playerId, id, value, maxValue, false] })
		);
		socket.on('playerSpecChange', (playerId, id, value) =>
			dispatch({ type: 'updateSpec', data: [playerId, id, value] })
		);
		socket.on('playerCurrencyChange', (playerId, id, value) =>
			dispatch({ type: 'updateCurrency', data: [playerId, id, value] })
		);
		socket.on('playerCharacteristicChange', (playerId, id, value, modifier) =>
			dispatch({ type: 'updateCharacteristic', data: [playerId, id, value, modifier] })
		);
		socket.on('playerSkillChange', (playerId, id, value, modifier) =>
			dispatch({ type: 'updateSkill', data: [playerId, id, value, modifier] })
		);
		socket.on('playerEquipmentAdd', (playerId, equipment) =>
			dispatch({ type: 'addEquipment', data: [playerId, equipment] })
		);
		socket.on('playerEquipmentRemove', (playerId, id) =>
			dispatch({ type: 'removeEquipment', data: [playerId, id] })
		);
		socket.on('playerItemAdd', (playerId, item, description, quantity) =>
			dispatch({ type: 'addItem', data: [playerId, item, description, quantity] })
		);
		socket.on('playerItemRemove', (playerId, id) =>
			dispatch({ type: 'removeItem', data: [playerId, id] })
		);
		socket.on('playerItemChange', (playerId, id, description, quantity) =>
			dispatch({ type: 'updateItem', data: [playerId, id, description, quantity] })
		);
		socket.on('playerSpellAdd', (playerId, spell) =>
			dispatch({ type: 'addSpell', data: [playerId, spell] })
		);
		socket.on('playerSpellRemove', (playerId, id) =>
			dispatch({ type: 'removeSpell', data: [playerId, id] })
		);
		socket.on('playerMaxLoadChange', (playerId, value) =>
			dispatch({ type: 'updateMaxLoad', data: [playerId, value] })
		);
		socket.on('playerSpellSlotsChange', (playerId, value) =>
			dispatch({ type: 'updateSpellSlots', data: [playerId, value] })
		);

		return () => {
			socket.off('playerAttributeStatusChange');
			socket.off('playerNameChange');
			socket.off('playerInfoChange');
			socket.off('playerAttributeChange');
			socket.off('playerSpecChange');
			socket.off('playerCurrencyChange');
			socket.off('playerCharacteristicChange');
			socket.off('playerSkillChange');
			socket.off('playerEquipmentAdd');
			socket.off('playerEquipmentRemove');
			socket.off('playerItemAdd');
			socket.off('playerItemRemove');
			socket.off('playerItemChange');
			socket.off('playerSpellAdd');
			socket.off('playerSpellRemove');
			socket.off('playerMaxLoadChange');
			socket.off('playerSpellSlotsChange');
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
							<Row>
								<AvatarField
									playerId={player.id}
									status={player.PlayerAttributeStatus.map((stat) => {
										return { id: stat.AttributeStatus.id, value: stat.value };
									})}
								/>
							</Row>
							<Row className='mt-2'>
								<Col>
									<Row>
										<Col className='h5'>{player.name || 'Desconhecido'}</Col>
									</Row>
									<Row>
										<Col>Nome</Col>
									</Row>
								</Col>
								{player.PlayerInfo.map((info) => {
									return (
										<Col key={info.Info.id}>
											<Row>
												<Col className='h5'>{info.value}</Col>
											</Row>
											<Row>
												<Col>{info.Info.name}</Col>
											</Row>
										</Col>
									);
								})}
							</Row>
							<hr />
							{player.PlayerAttributes.length > 0 && (
								<>
									<Row>
										{player.PlayerAttributes.map((attr) => (
											<Col key={attr.Attribute.id}>
												<Row>
													<Col
														className='h5'
														style={{ color: `#${attr.Attribute.color}` }}>
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
								</>
							)}
							{player.PlayerSpec.length > 0 && (
								<>
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
								</>
							)}
							{player.PlayerCurrency.length > 0 && (
								<>
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
								</>
							)}
							{player.PlayerCharacteristic.length > 0 && (
								<>
									<Row>
										{player.PlayerCharacteristic.map((char) => {
											let value = char.value.toString();
											if (props.characteristicModifierEnabled && char.modifier !== 0) {
												value +=
													(char.modifier > 0 ? '+' : '-') + `${Math.abs(char.modifier)}`;
											}
											return (
												<Col key={char.Characteristic.id}>
													<Row>
														<Col className='h5'>{value}</Col>
													</Row>
													<Row>
														<Col>{char.Characteristic.name}</Col>
													</Row>
												</Col>
											);
										})}
									</Row>
									<hr />
								</>
							)}
							{player.PlayerSkill.length > 0 && (
								<>
									<Row>
										{player.PlayerSkill.map((skill) => {
											let value = skill.value.toString();
											if (props.skillModifierEnabled && skill.modifier !== 0) {
												value +=
													(skill.modifier > 0 ? '+' : '-') +
													`${Math.abs(skill.modifier)}`;
											}
											return (
												<Col key={skill.Skill.id}>
													<Row>
														<Col className='h5'>{value}</Col>
													</Row>
													<Row>
														<Col>{skill.Skill.name}</Col>
													</Row>
												</Col>
											);
										})}
									</Row>
									<hr />
								</>
							)}
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
							<hr />
							<Row>
								<Col className='h3'>Magias</Col>
							</Row>
							<Row className='mb-2 h6'>
								<Col>
									<SpellHeader
										playerSpell={player.PlayerSpell}
										maxSlots={player.spellSlots}
									/>
								</Col>
							</Row>
							<Row className='mb-2'>
								<Col>
									{player.PlayerSpell.map((spell) => (
										<Row key={spell.Spell.id} className='mb-2'>
											<Col
												title={`${spell.Spell.description} (Slots: ${spell.Spell.slots})`}>
												{spell.Spell.name}
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

function SpellHeader({
	playerSpell,
	maxSlots,
}: {
	playerSpell: { Spell: { slots: number } }[];
	maxSlots: number;
}) {
	const slots = playerSpell.reduce((prev, cur) => prev + cur.Spell.slots, 0);
	return (
		<>
			Slots Ocupados:{' '}
			<span style={{ color: slots > maxSlots ? 'red' : '' }}>
				{slots}/{maxSlots}
			</span>
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
