import type { Currency, Item, PlayerItem } from '@prisma/client';
import type { FormEvent } from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { BsTrash } from 'react-icons/bs';
import { FaHandHolding, FaHandsHelping } from 'react-icons/fa';
import { ErrorLogger, Socket } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import type {
	ItemAddEvent,
	ItemChangeEvent,
	ItemRemoveEvent,
	PlayerTradeRequestEvent,
	PlayerTradeResponseEvent,
} from '../../utils/socket';
import BottomTextInput from '../BottomTextInput';
import CustomSpinner from '../CustomSpinner';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';
import type { Trade } from '../Modals/PlayerTradeModal';
import PlayerTradeModal from '../Modals/PlayerTradeModal';

type PlayerItemContainerProps = {
	playerItems: {
		currentDescription: string;
		quantity: number;
		Item: Item;
	}[];
	availableItems: Item[];
	playerMaxLoad: number;
	playerCurrency: {
		value: string;
		Currency: Currency;
	}[];
	title: string;
	npcId?: number;
	partners?: {
		id: number;
		name: string;
	}[];
};

const tradeInitialValue: Trade<Item> = {
	type: 'item',
	show: false,
	offer: { id: 0, name: '' } as Item,
	donation: true,
};

const tradeTimeLimit = 10000;

export default function PlayerItemContainer(props: PlayerItemContainerProps) {
	const [addItemModalShow, setAddItemModalShow] = useState(false);
	const [availableItems, setAvailableItems] = useState<{ id: number; name: string }[]>(
		props.availableItems
	);
	const [playerItems, setPlayerItems] = useState(props.playerItems);
	const [load, setLoad] = useState(
		playerItems.reduce((prev, cur) => prev + cur.Item.weight * cur.quantity, 0)
	);
	const [loading, setLoading] = useState(false);
	const [maxLoad, setMaxLoad, isClean] = useExtendedState(props.playerMaxLoad.toString());
	const [trade, setTrade] = useState<Trade<Item>>(tradeInitialValue);
	const currentTradeId = useRef<number | null>(null);
	const tradeTimeout = useRef<NodeJS.Timeout | null>(null);

	const logError = useContext(ErrorLogger);
	const socket = useContext(Socket);

	const socket_itemAdd = useRef<ItemAddEvent>(() => {});
	const socket_itemRemove = useRef<ItemRemoveEvent>(() => {});
	const socket_itemChange = useRef<ItemChangeEvent>(() => {});
	const socket_requestReceived = useRef<PlayerTradeRequestEvent>(() => {});
	const socket_responseReceived = useRef<PlayerTradeResponseEvent>(() => {});

	useEffect(() => {
		socket_itemAdd.current = (id, name) => {
			if (availableItems.findIndex((it) => it.id === id) > -1) return;
			setAvailableItems((items) => [...items, { id, name }]);
		};

		socket_itemRemove.current = (id) => {
			const index = playerItems.findIndex((it) => it.Item.id === id);
			if (index === -1) return;

			setPlayerItems((items) => {
				const newItems = [...items];
				newItems.splice(index, 1);
				return newItems;
			});
		};

		socket_itemChange.current = (it) => {
			const availableIndex = availableItems.findIndex((_it) => _it.id === it.id);
			const playerIndex = playerItems.findIndex((_it) => _it.Item.id === it.id);

			if (it.visible) {
				if (availableIndex === -1 && playerIndex === -1)
					return setAvailableItems((items) => [...items, it]);
			} else if (availableIndex > -1) {
				return setAvailableItems((items) => {
					const newItems = [...items];
					newItems.splice(availableIndex, 1);
					return newItems;
				});
			}

			if (availableIndex > -1) {
				setAvailableItems((items) => {
					const newItems = [...items];
					newItems[availableIndex] = it;
					return newItems;
				});
				return;
			}

			if (playerIndex === -1) return;

			setPlayerItems((items) => {
				const newItems = [...items];
				newItems[playerIndex].Item = it;
				return newItems;
			});
		};

		socket_requestReceived.current = (
			type,
			tradeId,
			receiverObjectId,
			senderName,
			itemName
		) => {
			if (type !== 'item') return;

			currentTradeId.current = tradeId;

			const item = playerItems.find((it) => it.Item.id === receiverObjectId);

			const accept = confirm(
				`${senderName} te ofereceu ${itemName}${
					receiverObjectId ? ` em troca de ${item?.Item.name}.` : '.'
				}` + ' Você deseja aceitar essa proposta?'
			);

			api
				.post('/sheet/player/trade/item', {
					tradeId,
					accept,
				})
				.then((res) => {
					if (!accept) return;

					const newItem: PlayerItem & { Item: Item } = res.data.item;

					if (receiverObjectId) {
						const index = playerItems.findIndex((it) => it.Item.id === receiverObjectId);
						if (index === -1) return;
						const oldItem = playerItems[index];

						availableItems.push(oldItem.Item);
						playerItems[index] = newItem;
					} else {
						playerItems.push(newItem);
					}
					availableItems.splice(
						availableItems.findIndex((e) => e.id === newItem.Item.id),
						1
					);

					setPlayerItems([...playerItems]);
					setAvailableItems([...availableItems]);
				})
				.catch(logError)
				.finally(() => (currentTradeId.current = null));
		};

		socket_responseReceived.current = (accept, tradeRes) => {
			if (!currentTradeId.current) return;

			currentTradeId.current = null;
			if (tradeTimeout.current) {
				clearTimeout(tradeTimeout.current);
				tradeTimeout.current = null;
			}

			if (accept) {
				const index = playerItems.findIndex((e) => e.Item.id === trade.offer.id);
				if (index === -1) return;

				if (tradeRes) {
					if (tradeRes.type !== 'item') return logError(new Error('Expected Item'));
					const oldItem = playerItems[index];

					availableItems.push(oldItem.Item);
					availableItems.splice(
						availableItems.findIndex((e) => e.id === tradeRes.obj.Item.id),
						1
					);
					setAvailableItems([...availableItems]);

					playerItems[index] = tradeRes.obj;
				} else {
					const item = playerItems.splice(index, 1)[0];
					setAvailableItems((e) => [...e, item.Item]);
				}

				setPlayerItems([...playerItems]);
			} else {
				alert('O jogador rejeitou sua proposta.');
			}
			setLoading(false);
			setTrade(tradeInitialValue);
		};
	});

	useEffect(() => {
		socket.on('itemAdd', (id, name) => socket_itemAdd.current(id, name));
		socket.on('itemRemove', (id) => socket_itemRemove.current(id));
		socket.on('itemChange', (item) => socket_itemChange.current(item));
		socket.on(
			'playerTradeRequest',
			(type, tradeId, receiverObjectId, senderName, senderObjectName) =>
				socket_requestReceived.current(
					type,
					tradeId,
					receiverObjectId,
					senderName,
					senderObjectName
				)
		);
		socket.on('playerTradeResponse', (accept, item) =>
			socket_responseReceived.current(accept, item)
		);
		return () => {
			socket.off('itemAdd');
			socket.off('itemRemove');
			socket.off('itemChange');
			socket.off('playerTradeRequest');
			socket.off('playerTradeResponse');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function onAddItem(id: number) {
		setLoading(true);
		api
			.put('/sheet/player/item', { id, npcId: props.npcId })
			.then((res) => {
				const item = res.data.item;
				setPlayerItems([...playerItems, item]);

				const newItems = [...availableItems];
				newItems.splice(
					newItems.findIndex((_item) => _item.id === id),
					1
				);
				setAvailableItems(newItems);
			})
			.catch(logError)
			.finally(() => {
				setAddItemModalShow(false);
				setLoading(false);
			});
	}

	function onDeleteItem(id: number) {
		const newPlayerItems = [...playerItems];
		const index = newPlayerItems.findIndex((_item) => _item.Item.id === id);

		newPlayerItems.splice(index, 1);
		setPlayerItems(newPlayerItems);

		const modalItem = { id, name: playerItems[index].Item.name };
		setAvailableItems([...availableItems, modalItem]);
	}

	function onTradeShow(id: number, donation: boolean) {
		if (currentTradeId.current) {
			return alert(
				'Você ainda está em uma troca. ' +
					'Por favor, espere esta troca concluir antes de começar uma nova.'
			);
		}

		const item = playerItems.find((item) => item.Item.id === id);
		if (!item) return;

		return setTrade({
			type: 'item',
			show: true,
			offer: item.Item,
			donation,
		});
	}

	function onTradeSubmit(playerId: number, tradeId?: number) {
		setLoading(true);
		api
			.put('/sheet/player/trade/item', {
				offerId: trade.offer.id,
				playerId,
				tradeId,
			})
			.then((res) => {
				currentTradeId.current = res.data.id;
				tradeTimeout.current = setTimeout(() => {
					onTradeHide();
					alert(`A troca excedeu o tempo limite (${tradeTimeLimit}ms) e foi cancelada.`);
				}, tradeTimeLimit);
			})
			.catch((err) => {
				logError(err);
				setLoading(false);
				setTrade(tradeInitialValue);
			});
	}

	function onTradeHide() {
		if (currentTradeId.current) {
			api
				.delete('/sheet/player/trade/item', {
					data: {
						tradeId: currentTradeId.current,
					},
				})
				.catch(logError)
				.finally(() => (currentTradeId.current = null));
		}

		setTrade(tradeInitialValue);
		setLoading(false);

		if (tradeTimeout.current) {
			clearTimeout(tradeTimeout.current);
			tradeTimeout.current = null;
		}
	}

	function onMaxLoadBlur() {
		if (isClean()) return;
		let maxLoadFloat = parseFloat(maxLoad);
		if (isNaN(maxLoadFloat)) {
			maxLoadFloat = 0;
			setMaxLoad(maxLoadFloat.toString());
		} else setMaxLoad(maxLoad);
		api
			.post('/sheet/player', { maxLoad: maxLoadFloat, npcId: props.npcId })
			.catch(logError);
	}

	function onQuantityChange(id: number, value: number) {
		setLoad(
			playerItems.reduce((prev, cur) => {
				if (cur.Item.id === id) cur.quantity = value;
				return prev + cur.Item.weight * cur.quantity;
			}, 0)
		);
	}

	const colorStyle = { color: load > parseFloat(maxLoad) ? 'red' : 'inherit' };

	const playerItemList = useMemo(() => {
		return playerItems.sort((a, b) => a.Item.id - b.Item.id);
	}, [playerItems]);

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setAddItemModalShow(true), disabled: loading }}>
				<Row className='text-center justify-content-center'>
					{props.playerCurrency.map((curr) => (
						<PlayerCurrencyField
							key={curr.Currency.id}
							currency={curr}
							npcId={props.npcId}
						/>
					))}
				</Row>
				<hr />
				<Row>
					<Col className='text-center h5'>
						<span className='me-2'>Capacidade:</span>
						<span style={colorStyle}> {load} /</span>
						<BottomTextInput
							value={maxLoad}
							onChange={(ev) => setMaxLoad(ev.currentTarget.value)}
							onBlur={onMaxLoadBlur}
							className='text-center'
							style={{ ...colorStyle, maxWidth: '3rem' }}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<Table responsive className='align-middle text-center'>
							<thead>
								<tr>
									<th></th>
									{props.partners && props.partners.length > 0 && (
										<>
											<th></th>
											<th></th>
										</>
									)}
									<th>Nome</th>
									<th>Descrição</th>
									<th>Peso</th>
									<th>Quant.</th>
								</tr>
							</thead>
							<tbody>
								{playerItemList.map((item) => (
									<PlayerItemField
										key={item.Item.id}
										description={item.currentDescription}
										item={item.Item}
										quantity={item.quantity}
										onDelete={() => onDeleteItem(item.Item.id)}
										onQuantityChange={onQuantityChange}
										disableTrades={props.partners?.length === 0}
										onTrade={(donation) => onTradeShow(item.Item.id, donation)}
										npcId={props.npcId}
									/>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
			</DataContainer>
			<AddDataModal
				title='Adicionar'
				show={addItemModalShow}
				onHide={() => setAddItemModalShow(false)}
				data={availableItems}
				onAddData={onAddItem}
				disabled={loading}
			/>
			{props.partners && props.partners.length > 0 && (
				<PlayerTradeModal
					{...trade}
					partners={props.partners}
					onHide={onTradeHide}
					onSubmit={onTradeSubmit}
					disabled={loading}
				/>
			)}
		</>
	);
}

type PlayerCurrencyFieldProps = {
	currency: {
		value: string;
		Currency: Currency;
	};
	npcId?: number;
};

function PlayerCurrencyField({ currency, npcId }: PlayerCurrencyFieldProps) {
	const logError = useContext(ErrorLogger);
	const [value, setValue, isClean] = useExtendedState(currency.value);

	function onBlur() {
		if (isClean()) return;
		api
			.post('/sheet/player/currency', { id: currency.Currency.id, value, npcId })
			.catch(logError);
	}

	return (
		<Col xs={12} md={6}>
			<FormLabel htmlFor={`playerCurrency${currency.Currency.id}`}>
				{currency.Currency.name}:
			</FormLabel>
			<BottomTextInput
				id={`playerCurrency${currency.Currency.id}`}
				value={value}
				onChange={(ev) => setValue(ev.currentTarget.value)}
				onBlur={onBlur}
				className='ms-2'
				style={{ maxWidth: '7rem' }}
				autoComplete='off'
			/>
		</Col>
	);
}

type PlayerItemFieldProps = {
	quantity: number;
	description: string;
	item: {
		id: number;
		name: string;
		weight: number;
	};
	disableTrades?: boolean;
	onDelete: () => void;
	onTrade: (donation: boolean) => void;
	onQuantityChange: (id: number, value: number) => void;
	npcId?: number;
};

function PlayerItemField(props: PlayerItemFieldProps) {
	const [currentQuantity, setCurrentQuantity, isQuantityClean] = useExtendedState(
		props.quantity
	);
	const [currentDescription, setCurrentDescription, isDescriptionClean] =
		useExtendedState(props.description);
	const [loading, setLoading] = useState(false);
	const logError = useContext(ErrorLogger);
	const itemID = props.item.id;

	function deleteItem() {
		if (!confirm('Você realmente deseja excluir esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/player/item', {
				data: { id: itemID, npcId: props.npcId },
			})
			.then(props.onDelete)
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function quantityChange(ev: FormEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newQuantity = parseInt(aux);

		if (aux.length === 0) newQuantity = 0;
		else if (isNaN(newQuantity)) return;

		setCurrentQuantity(newQuantity);
	}

	function quantityBlur() {
		if (isQuantityClean()) return;
		api
			.post('/sheet/player/item', {
				id: itemID,
				quantity: currentQuantity,
				npcId: props.npcId,
			})
			.then(() => {
				props.onQuantityChange(itemID, currentQuantity);
			})
			.catch(logError);
	}

	function descriptionBlur() {
		if (isDescriptionClean()) return;
		api
			.post('/sheet/player/item', { id: itemID, currentDescription, npcId: props.npcId })
			.catch(logError);
	}

	return (
		<tr>
			<td>
				<Button
					onClick={deleteItem}
					disabled={loading}
					size='sm'
					variant='secondary'
					aria-label='Apagar'>
					{loading ? <CustomSpinner /> : <BsTrash color='white' size='1.5rem' />}
				</Button>
			</td>
			{!props.disableTrades && (
				<>
					<td>
						<Button
							aria-label='Transferir'
							onClick={() => props.onTrade(true)}
							size='sm'
							variant='secondary'
							disabled={loading}>
							{loading ? (
								<CustomSpinner />
							) : (
								<FaHandHolding color='white' size='1.5rem' />
							)}
						</Button>
					</td>
					<td>
						<Button
							aria-label='Trocar'
							onClick={() => props.onTrade(false)}
							size='sm'
							variant='secondary'
							disabled={loading}>
							{loading ? (
								<CustomSpinner />
							) : (
								<FaHandsHelping color='white' size='1.5rem' />
							)}
						</Button>
					</td>
				</>
			)}
			<td>{props.item.name}</td>
			<td>
				<FormControl
					as='textarea'
					rows={2}
					className='theme-element'
					disabled={loading}
					value={currentDescription}
					style={{ minWidth: '20rem' }}
					onChange={(ev) => setCurrentDescription(ev.currentTarget.value)}
					onBlur={descriptionBlur}
				/>
			</td>
			<td style={{ maxWidth: '5rem' }}>{props.item.weight}</td>
			<td>
				<BottomTextInput
					disabled={loading}
					style={{ maxWidth: '3rem' }}
					maxLength={3}
					value={currentQuantity}
					onChange={quantityChange}
					onBlur={quantityBlur}
					className='text-center'
				/>
			</td>
		</tr>
	);
}
