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
import CustomSpinner from '../../CustomSpinner';
import DataContainer from '../../DataContainer';
import CreateCharacteristicModal from '../../Modals/CreateCharacteristicModal';
import AdminTable from '../AdminTable';

type CharacteristicEditorContainerProps = {
	characteristics: Characteristic[];
	title: string;
};

export default function CharacteristicEditorContainer(
	props: CharacteristicEditorContainerProps
) {
	const [loading, setLoading] = useState(false);
	const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
	const [characteristic, setCharacteristic] = useState(props.characteristics);
	const logError = useContext(ErrorLogger);

	function createCharacteristic(name: string) {
		setLoading(true);
		api
			.put('/sheet/characteristic', { name })
			.then((res) => {
				const id = res.data.id;
				setCharacteristic([...characteristic, { id, name }]);
			})
			.catch(logError)
			.finally(() => {
				setShowCharacteristicModal(false);
				setLoading(false);
			});
	}

	function deleteCharacteristic(id: number) {
		const newCharacteristic = [...characteristic];
		const index = newCharacteristic.findIndex((char) => char.id === id);
		if (index > -1) {
			newCharacteristic.splice(index, 1);
			setCharacteristic(newCharacteristic);
		}
	}

	return (
		<>
			<DataContainer
				outline
				title={props.title}
				addButton={{
					onAdd: () => setShowCharacteristicModal(true),
					disabled: loading,
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
				disabled={loading}
			/>
		</>
	);
}

type CharacteristicEditorFieldProps = {
	characteristic: Characteristic;
	onDelete: (id: number) => void;
};

function CharacteristicEditorField(props: CharacteristicEditorFieldProps) {
	const [loading, setLoading] = useState(false);
	const [lastName, name, setName] = useExtendedState(props.characteristic.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api
			.post('/sheet/characteristic', { id: props.characteristic.id, name })
			.catch(logError);
	}

	function onDelete() {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/characteristic', { data: { id: props.characteristic.id } })
			.then(() => props.onDelete(props.characteristic.id))
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
					onBlur={onBlur}
					disabled={loading}
				/>
			</td>
		</tr>
	);
}
