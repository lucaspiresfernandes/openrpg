import type { Attribute, AttributeStatus } from '@prisma/client';
import type { ChangeEvent } from 'react';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import DataContainer from '../../DataContainer';
import CreateAttributeModal from '../../Modals/CreateAttributeModal';
import CreateAttributeStatusModal from '../../Modals/CreateAttributeStatusModal';

type AttributeEditorContainerProps = {
	attributes: Attribute[];
	attributeStatus: AttributeStatus[];
};

export default function AttributeEditorContainer(props: AttributeEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showAttributeModal, setShowAttributeModal] = useState(false);
	const [attributes, setAttributes] = useState(props.attributes);
	const [showAttributeStatusModal, setShowAttributeStatusModal] = useState(false);
	const [attributeStatus, setAttributeStatus] = useState(props.attributeStatus);

	function onAttributeNameChange(id: number, name: string) {
		const newAttributes = [...attributes];
		const attr = newAttributes.find((attr) => attr.id === id);
		if (attr) {
			attr.name = name;
			setAttributes(newAttributes);
		}
	}

	function createAttribute(name: string, rollable: boolean) {
		api
			.put('/sheet/attribute', { name, rollable })
			.then((res) => {
				const id = res.data.id;
				setAttributes([...attributes, { id, name, rollable, color: res.data.color }]);
			})
			.catch(logError);
	}

	function deleteAttribute(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/attribute', { data: { id } })
			.then(() => {
				const newAttribute = [...attributes];
				const index = newAttribute.findIndex((attr) => attr.id === id);
				if (index > -1) {
					newAttribute.splice(index, 1);
					setAttributes(newAttribute);
				}
			})
			.catch(logError);
	}

	function createAttributeStatus(name: string, attributeID: number) {
		api
			.put('/sheet/attribute/status', { name, attributeID })
			.then((res) => {
				const id = res.data.id;
				setAttributeStatus([...attributeStatus, { id, name, attribute_id: attributeID }]);
			})
			.catch(logError);
	}

	function deleteAttributeStatus(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/attribute/status', { data: { id } })
			.then(() => {
				const newAttributeStatus = [...attributeStatus];
				const index = newAttributeStatus.findIndex((status) => status.id === id);
				if (index > -1) {
					newAttributeStatus.splice(index, 1);
					setAttributeStatus(newAttributeStatus);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<Row>
				<DataContainer
					outline
					title='Barras de Atributo'
					addButton={{ onAdd: () => setShowAttributeModal(true) }}>
					<Row>
						<Col>
							<Table responsive className='align-middle'>
								<thead>
									<tr>
										<th></th>
										<th title='Nome do Atributo.'>Nome</th>
										<th title='Cor do Atributo.'>Cor</th>
										<th title='Define se o Atributo pode ser usado para testes de dado.'>
											Testável
										</th>
									</tr>
								</thead>
								<tbody>
									{attributes.map((attribute) => (
										<AttributeEditorField
											key={attribute.id}
											attribute={attribute}
											onDelete={deleteAttribute}
											onNameChange={onAttributeNameChange}
										/>
									))}
								</tbody>
							</Table>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<Row>
				<DataContainer
					outline
					title='Status de Atributos'
					addButton={{ onAdd: () => setShowAttributeStatusModal(true) }}>
					<Row>
						<Col>
							<Table responsive className='align-middle'>
								<thead>
									<tr>
										<th></th>
										<th title='Nome do Status de Atributo.'>Nome</th>
										<th title='Define a qual Atributo esse Status será ligado.'>
											Atributo
										</th>
									</tr>
								</thead>
								<tbody>
									{attributeStatus.map((stat) => (
										<AttributeStatusEditorField
											key={stat.id}
											attributeStatus={stat}
											attributes={attributes}
											onDelete={deleteAttributeStatus}
										/>
									))}
								</tbody>
							</Table>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<CreateAttributeModal
				show={showAttributeModal}
				onHide={() => setShowAttributeModal(false)}
				onCreate={createAttribute}
			/>
			<CreateAttributeStatusModal
				show={showAttributeStatusModal}
				onHide={() => setShowAttributeStatusModal(false)}
				onCreate={createAttributeStatus}
				attributes={attributes}
			/>
		</>
	);
}

type AttributeEditorFieldProps = {
	attribute: Attribute;
	onDelete(id: number): void;
	onNameChange?(id: number, newName: string): void;
};

function AttributeEditorField(props: AttributeEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.attribute.name);
	const [lastColor, color, setColor] = useExtendedState(`#${props.attribute.color}`);
	const [rollable, setRollable] = useState(props.attribute.rollable);
	const logError = useContext(ErrorLogger);

	function onNameBlur() {
		if (name === lastName) return;
		setName(name);
		if (props.onNameChange) props.onNameChange(props.attribute.id, name);
		api.post('/sheet/attribute', { id: props.attribute.id, name }).catch(logError);
	}

	function onColorBlur() {
		if (color === lastColor) return;
		setColor(color);
		api
			.post('/sheet/attribute', { id: props.attribute.id, color: color.substring(1) })
			.catch(logError);
	}

	function changeRollable() {
		const newRollable = !rollable;
		setRollable(newRollable);
		api
			.post('/sheet/attribute', { id: props.attribute.id, rollable: newRollable })
			.catch((err) => {
				setRollable(rollable);
				logError(err);
			});
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.attribute.id)}
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
				/>
			</td>
			<td>
				<FormControl
					type='color'
					value={color}
					onChange={(ev) => setColor(ev.currentTarget.value)}
					onBlur={onColorBlur}
					className='theme-element'
				/>
			</td>
			<td>
				<FormCheck checked={rollable} onChange={changeRollable} />
			</td>
		</tr>
	);
}

type AttributeStatusEditorFieldProps = {
	attributeStatus: AttributeStatus;
	attributes: Attribute[];
	onDelete(id: number): void;
};

function AttributeStatusEditorField(props: AttributeStatusEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.attributeStatus.name);
	const [attributeID, setAttributeID] = useState(props.attributeStatus.attribute_id);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api
			.post('/sheet/attribute/status', { id: props.attributeStatus.id, name })
			.catch(logError);
	}

	function attributeChange(ev: ChangeEvent<HTMLSelectElement>) {
		const newID = parseInt(ev.currentTarget.value);
		setAttributeID(newID);
		api
			.post('/sheet/attribute/status', {
				id: props.attributeStatus.id,
				attributeID: newID,
			})
			.catch((err) => {
				logError(err);
				setAttributeID(attributeID);
			});
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.attributeStatus.id)}
					size='sm'
					variant='secondary'>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
				/>
			</td>
			<td>
				<select className='theme-element' value={attributeID} onChange={attributeChange}>
					{props.attributes.map((attr) => (
						<option key={attr.id} value={attr.id}>
							{attr.name}
						</option>
					))}
				</select>
			</td>
		</tr>
	);
}
