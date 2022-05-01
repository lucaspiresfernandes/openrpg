import type { ExtraInfo } from '@prisma/client';
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
import CreateExtraInfoModal from '../../Modals/CreateExtraInfoModal';
import AdminTable from '../AdminTable';

type ExtraInfoEditorContainerProps = {
	extraInfo: ExtraInfo[];
	disabled?: boolean;
	title: string;
};

export default function ExtraInfoEditorContainer(props: ExtraInfoEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [extraInfo, setExtraInfo] = useState(props.extraInfo);

	function createExtraInfo(name: string) {
		api
			.put('/sheet/extrainfo', { name })
			.then((res) => {
				const id = res.data.id;
				setExtraInfo([...extraInfo, { id, name }]);
			})
			.catch(logError);
	}

	function deleteExtraInfo(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/extrainfo', { data: { id } })
			.then(() => {
				const newExtraInfo = [...extraInfo];
				const index = newExtraInfo.findIndex((extraInfo) => extraInfo.id === id);
				if (index > -1) {
					newExtraInfo.splice(index, 1);
					setExtraInfo(newExtraInfo);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<DataContainer
				outline
				title={`${props.title} (Extra)`}
				addButton={{ onAdd: () => setShowInfoModal(true), disabled: props.disabled }}>
				<Row>
					<Col>
						<AdminTable>
							<thead>
								<tr>
									<th></th>
									<th title='Nome da Informação Pessoal.'>Nome</th>
								</tr>
							</thead>
							<tbody>
								{extraInfo.map((info) => (
									<ExtraInfoEditorField
										key={info.id}
										deleteDisabled={props.disabled}
										extraInfo={info}
										onDelete={deleteExtraInfo}
									/>
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateExtraInfoModal
				show={showInfoModal}
				onHide={() => setShowInfoModal(false)}
				onCreate={createExtraInfo}
			/>
		</>
	);
}

type ExtraInfoEditorFieldProps = {
	extraInfo: ExtraInfo;
	deleteDisabled?: boolean;
	onDelete(id: number): void;
};

function ExtraInfoEditorField(props: ExtraInfoEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.extraInfo.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/extrainfo', { id: props.extraInfo.id, name }).catch(logError);
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.extraInfo.id)}
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
