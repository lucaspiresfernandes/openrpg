import type { Characteristic } from '@prisma/client';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import DataContainer from '../../DataContainer';
import CreateCharacteristicModal from '../../Modals/CreateCharacteristicModal';
import AdminTable from '../AdminTable';

type CharacteristicEditorContainerProps = {
	characteristics: Characteristic[];
	disabled?: boolean;
	title: string;
};

export default function CharacteristicEditorContainer(
	props: CharacteristicEditorContainerProps
) {
	const logError = useContext(ErrorLogger);
	const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
	const [characteristic, setCharacteristic] = useState(props.characteristics);

	function createCharacteristic(name: string) {
		api
			.put('/sheet/characteristic', { name })
			.then((res) => {
				const id = res.data.id;
				setCharacteristic([...characteristic, { id, name }]);
			})
			.catch(logError);
	}

	function deleteCharacteristic(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/characteristic', { data: { id } })
			.then(() => {
				const newCharacteristic = [...characteristic];
				const index = newCharacteristic.findIndex((char) => char.id === id);
				if (index > -1) {
					newCharacteristic.splice(index, 1);
					setCharacteristic(newCharacteristic);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{
					onAdd: () => setShowCharacteristicModal(true),
					disabled: props.disabled,
				}}>
				<Row>
					<Col>
						<AdminTable>
							<thead>
								<tr>
									<th></th>
									<th title='Nome da Característica.'>Nome</th>
								</tr>
							</thead>
							<tbody>
								{characteristic.map((characteristic) => (
									<CharacteristicEditorField
										key={characteristic.id}
										deleteDisabled={props.disabled}
										characteristic={characteristic}
										onDelete={deleteCharacteristic}
									/>
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateCharacteristicModal
				show={showCharacteristicModal}
				onHide={() => setShowCharacteristicModal(false)}
				onCreate={createCharacteristic}
			/>
		</>
	);
}

type CharacteristicEditorFieldProps = {
	characteristic: Characteristic;
	deleteDisabled?: boolean;
	onDelete(id: number): void;
};

function CharacteristicEditorField(props: CharacteristicEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.characteristic.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api
			.post('/sheet/characteristic', { id: props.characteristic.id, name })
			.catch(logError);
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.characteristic.id)}
					size='sm'
					variant='secondary'
					disabled={props.deleteDisabled}>
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
		</tr>
	);
}
