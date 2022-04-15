import { Currency, Item } from '@prisma/client';
import { FormEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FormLabel from 'react-bootstrap/FormLabel';
import { ErrorLogger, Socket } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';
import { BsTrash } from 'react-icons/bs';

type PlayerItemContainerProps = {
	playerItems: {
		Item: {
			id: number;
			name: string;
			weight: number;
		};
		currentDescription: string;
		quantity: number;
	}[];
	availableItems: Item[];
	playerMaxLoad: number;
	playerCurrency: {
		value: string;
		Currency: Currency;
	}[];
	title: string;
};

export default function PlayerItemContainer(props: PlayerItemContainerProps) {
	const [addItemShow, setAddItemShow] = useState(false);
	const [availableItems, setAvailableItems] = useState<{ id: number; name: string }[]>(
		props.availableItems
	);
	const [playerItems, setPlayerItems] = useState(props.playerItems);
	const playerItemsRef = useRef(playerItems);
	playerItemsRef.current = playerItems;
	const logError = useContext(ErrorLogger);
	const socket = useContext(Socket);
	const [lastMaxLoad, maxLoad, setMaxLoad] = useExtendedState(
		props.playerMaxLoad.toString()
	);
	const [load, setLoad] = useState(
		playerItems.reduce((prev, cur) => prev + cur.Item.weight * cur.quantity, 0)
	);

	useEffect(() => {
		if (!socket) return;

		socket.on('playerItemAdd', (id, name) => {
			setAvailableItems((items) => {
				if (
					items.findIndex((item) => item.id === id) > -1 ||
					playerItemsRef.current.findIndex((eq) => eq.Item.id === id) > -1
				)
					return items;
				return [...items, { id, name }];
			});
		});

		socket.on('playerItemRemove', (id) => {
			setAvailableItems((items) => {
				const index = items.findIndex((item) => item.id === id);
				if (index === -1) return items;

				const newItems = [...items];
				newItems.splice(index, 1);
				return newItems;
			});
		});

		socket.on('playerItemChange', (id, name) => {
			setPlayerItems((items) => {
				const index = items.findIndex((eq) => eq.Item.id === id);
				if (index === -1) return items;

				const newItems = [...items];
				newItems[index].Item.name = name;
				return newItems;
			});

			setAvailableItems((items) => {
				const index = items.findIndex((eq) => eq.id === id);
				if (index === -1) return items;

				const newItems = [...items];
				newItems[index].name = name;
				return newItems;
			});
		});

		return () => {
			socket.off('playerItemAdd');
			socket.off('playerItemRemove');
			socket.off('playerItemChange');
		};
	}, [socket]);

	function onAddItem(id: number) {
		api
			.put('/sheet/player/item', { id })
			.then((res) => {
				const item = res.data.item;
				setPlayerItems([...playerItems, item]);

				const newItems = [...availableItems];
				newItems.splice(
					newItems.findIndex((eq) => eq.id === id),
					1
				);
				setAvailableItems(newItems);
			})
			.catch(logError);
	}

	function onDeleteItem(id: number) {
		const newPlayerItems = [...playerItems];
		const index = newPlayerItems.findIndex((eq) => eq.Item.id === id);

		newPlayerItems.splice(index, 1);
		setPlayerItems(newPlayerItems);

		const modalItem = { id, name: playerItems[index].Item.name };
		setAvailableItems([...availableItems, modalItem]);
	}

	function onMaxLoadBlur() {
		if (maxLoad === lastMaxLoad) return;
		let maxLoadFloat = parseFloat(maxLoad);
		if (isNaN(maxLoadFloat)) {
			maxLoadFloat = 0;
			setMaxLoad(maxLoadFloat.toString());
		} else setMaxLoad(maxLoad);
		api.post('/sheet/player', { maxLoad: maxLoadFloat }).catch(logError);
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

	const items = useMemo(() => {
		return playerItems.sort((a, b) => a.Item.id - b.Item.id);
	}, [playerItems]);

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setAddItemShow(true) }}>
				<Row className='text-center justify-content-center'>
					{props.playerCurrency.map((curr) => (
						<PlayerCurrencyField key={curr.Currency.id} currency={curr} />
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
									<th>Nome</th>
									<th>Descrição</th>
									<th>Peso</th>
									<th>Quant.</th>
								</tr>
							</thead>
							<tbody>
								{items.map((item) => (
									<PlayerItemField
										key={item.Item.id}
										description={item.currentDescription}
										item={item.Item}
										quantity={item.quantity}
										onDelete={onDeleteItem}
										onQuantityChange={onQuantityChange}
									/>
								))}
							</tbody>
						</Table>
					</Col>
				</Row>
			</DataContainer>
			<AddDataModal
				title='Adicionar'
				show={addItemShow}
				onHide={() => setAddItemShow(false)}
				data={availableItems}
				onAddData={onAddItem}
			/>
		</>
	);
}

type PlayerCurrencyFieldProps = {
	currency: {
		value: string;
		Currency: Currency;
	};
};

function PlayerCurrencyField({ currency }: PlayerCurrencyFieldProps) {
	const logError = useContext(ErrorLogger);
	const [lastValue, value, setValue] = useExtendedState(currency.value);

	function onBlur() {
		if (lastValue === value) return;
		setValue(value);
		api
			.post('/sheet/player/currency', { id: currency.Currency.id, value })
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
	onDelete(id: number): void;
	onQuantityChange(id: number, value: number): void;
};

function PlayerItemField(props: PlayerItemFieldProps) {
	const [lastQuantity, currentQuantity, setCurrentQuantity] = useExtendedState(
		props.quantity
	);
	const [lastDescription, currentDescription, setCurrentDescription] = useExtendedState(
		props.description
	);
	const [loading, setLoading] = useState(false);
	const logError = useContext(ErrorLogger);
	const itemID = props.item.id;

	function deleteItem() {
		if (!confirm('Você realmente deseja excluir esse item?')) return;
		setLoading(true);
		props.onDelete(itemID);
		api
			.delete('/sheet/player/item', {
				data: { id: itemID },
			})
			.then(() => props.onDelete(itemID))
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
		if (currentQuantity === lastQuantity) return;
		setCurrentQuantity(currentQuantity);
		api
			.post('/sheet/player/item', { id: itemID, quantity: currentQuantity })
			.then(() => {
				props.onQuantityChange(itemID, currentQuantity);
			})
			.catch(logError);
	}

	function descriptionBlur() {
		if (currentDescription === lastDescription) return;
		setCurrentDescription(currentDescription);
		api.post('/sheet/player/item', { id: itemID, currentDescription }).catch(logError);
	}

	return (
		<tr>
			<td>
				<Button onClick={deleteItem} disabled={loading} size='sm' variant='secondary'>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td style={{ maxWidth: '7.5rem' }}>{props.item.name}</td>
			<td>
				<BottomTextInput
					value={currentDescription}
					style={{ minWidth: '20rem' }}
					onChange={(ev) => setCurrentDescription(ev.currentTarget.value)}
					onBlur={descriptionBlur}
				/>
			</td>
			<td style={{ maxWidth: '5rem' }}>{props.item.weight}</td>
			<td>
				<BottomTextInput
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
