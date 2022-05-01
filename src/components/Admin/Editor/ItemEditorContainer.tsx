import type { Item } from '@prisma/client';
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
import CreateItemModal from '../../Modals/CreateItemModal';
import AdminTable from '../AdminTable';

type ItemEditorContainerProps = {
	items: Item[];
	title: string;
};

export default function ItemEditorContainer(props: ItemEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showItemModal, setShowItemModal] = useState(false);
	const [item, setItem] = useState(props.items);

	function createItem(name: string, description: string) {
		api
			.put('/sheet/item', { name, description })
			.then((res) => {
				const id = res.data.id;
				setItem([...item, { id, name, description, weight: 0, visible: true }]);
			})
			.catch(logError);
	}

	function deleteItem(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/item', { data: { id } })
			.then(() => {
				const newItem = [...item];
				const index = newItem.findIndex((item) => item.id === id);
				if (index > -1) {
					newItem.splice(index, 1);
					setItem(newItem);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{ onAdd: () => setShowItemModal(true) }}>
				<Row>
					<Col>
						<AdminTable>
							<thead>
								<tr>
									<th></th>
									<th title='Nome do Item.'>Nome</th>
									<th title='Descrição do Item.'>Descrição</th>
									<th title='Peso do Item.'>Peso</th>
									<th title='Define se o Item será visível para o jogador.'>Visível</th>
								</tr>
							</thead>
							<tbody>
								{item.map((item) => (
									<ItemEditorField key={item.id} item={item} onDelete={deleteItem} />
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateItemModal
				show={showItemModal}
				onHide={() => setShowItemModal(false)}
				onCreate={createItem}
			/>
		</>
	);
}

type ItemEditorFieldProps = {
	item: Item;
	onDelete(id: number): void;
};

function ItemEditorField(props: ItemEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.item.name);
	const [lastDescription, description, setDescription] = useExtendedState(
		props.item.description
	);
	const [lastWeight, weight, setWeight] = useExtendedState(props.item.weight.toString());
	const [visible, setVisible] = useState(props.item.visible);
	const logError = useContext(ErrorLogger);

	function onNameBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/item', { id: props.item.id, name }).catch(logError);
	}

	function onDescriptionBlur() {
		if (description === lastDescription) return;
		setDescription(description);
		api.post('/sheet/item', { id: props.item.id, description }).catch(logError);
	}

	function onWeightBlur() {
		if (weight === lastWeight) return;
		let weightFloat = parseFloat(weight);
		if (isNaN(weightFloat)) {
			weightFloat = 0;
			setWeight(weightFloat.toString());
		} else setWeight(weight);
		api.post('/sheet/item', { id: props.item.id, weight: weightFloat }).catch(logError);
	}

	function onVisibleChange() {
		const newVisible = !visible;
		setVisible(newVisible);
		api.post('/sheet/item', { id: props.item.id, visible: newVisible }).catch((err) => {
			setVisible(visible);
			logError(err);
		});
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.item.id)}
					size='sm'
					variant='secondary'>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onNameBlur}
					style={{ maxWidth: '15rem' }}
				/>
			</td>
			<td>
				<BottomTextInput
					value={description}
					onChange={(ev) => setDescription(ev.currentTarget.value)}
					onBlur={onDescriptionBlur}
					style={{ minWidth: '45rem' }}
				/>
			</td>
			<td>
				<BottomTextInput
					value={weight}
					onChange={(ev) => setWeight(ev.currentTarget.value)}
					onBlur={onWeightBlur}
					style={{ maxWidth: '4rem' }}
					className='text-center'
				/>
			</td>
			<td>
				<FormCheck checked={visible} onChange={onVisibleChange} />
			</td>
		</tr>
	);
}
