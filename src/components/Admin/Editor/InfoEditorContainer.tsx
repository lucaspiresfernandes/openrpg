import { Info } from '@prisma/client';
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
import CreateInfoModal from '../../Modals/CreateInfoModal';
import AdminTable from '../AdminTable';

type InfoEditorContainerProps = {
	info: Info[];
	disabled?: boolean;
	title: string;
};

export default function InfoEditorContainer(props: InfoEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [info, setInfo] = useState(props.info);

	function createInfo(name: string) {
		api
			.put('/sheet/info', { name })
			.then((res) => {
				const id = res.data.id;
				setInfo([...info, { id, name, default: false }]);
			})
			.catch(logError);
	}

	function deleteInfo(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/info', { data: { id } })
			.then(() => {
				const newInfo = [...info];
				const index = newInfo.findIndex((info) => info.id === id);
				if (index > -1) {
					newInfo.splice(index, 1);
					setInfo(newInfo);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<DataContainer
				outline
				title={`${props.title} (Geral)`}
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
								{info.map((info) => (
									<InfoEditorField
										key={info.id}
										deleteDisabled={props.disabled}
										info={info}
										onDelete={deleteInfo}
									/>
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateInfoModal
				show={showInfoModal}
				onHide={() => setShowInfoModal(false)}
				onCreate={createInfo}
			/>
		</>
	);
}

type InfoEditorFieldProps = {
	info: Info;
	deleteDisabled?: boolean;
	onDelete(id: number): void;
};

function InfoEditorField(props: InfoEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.info.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/info', { id: props.info.id, name }).catch(logError);
	}

	return (
		<tr>
			<td>
				{!props.info.default && (
					<Button
						onClick={() => props.onDelete(props.info.id)}
						size='sm'
						variant='secondary'
						disabled={props.deleteDisabled}>
						<BsTrash color='white' size={24} />
					</Button>
				)}
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
					readOnly={props.info.default}
					disabled={props.info.default}
				/>
			</td>
		</tr>
	);
}
