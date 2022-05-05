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
import CustomSpinner from '../../CustomSpinner';
import DataContainer from '../../DataContainer';
import CreateExtraInfoModal from '../../Modals/CreateExtraInfoModal';
import AdminTable from '../AdminTable';

type ExtraInfoEditorContainerProps = {
	extraInfo: ExtraInfo[];
	title: string;
};

export default function ExtraInfoEditorContainer(props: ExtraInfoEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [extraInfo, setExtraInfo] = useState(props.extraInfo);
	const logError = useContext(ErrorLogger);

	function createExtraInfo(name: string) {
		setLoading(true);
		api
			.put('/sheet/extrainfo', { name })
			.then((res) => {
				const id = res.data.id;
				setExtraInfo([...extraInfo, { id, name }]);
			})
			.catch(logError)
			.finally(() => {
				setShowInfoModal(false);
				setLoading(false);
			});
	}

	function deleteExtraInfo(id: number) {
		const newExtraInfo = [...extraInfo];
		const index = newExtraInfo.findIndex((extraInfo) => extraInfo.id === id);
		if (index > -1) {
			newExtraInfo.splice(index, 1);
			setExtraInfo(newExtraInfo);
		}
	}

	return (
		<>
			<DataContainer
				outline
				title={`${props.title} (Extra)`}
				addButton={{ onAdd: () => setShowInfoModal(true), disabled: loading }}>
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
				disabled={loading}
			/>
		</>
	);
}

type ExtraInfoEditorFieldProps = {
	extraInfo: ExtraInfo;
	onDelete: (id: number) => void;
};

function ExtraInfoEditorField(props: ExtraInfoEditorFieldProps) {
	const [loading, setLoading] = useState(false);
	const [lastName, name, setName] = useExtendedState(props.extraInfo.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/extrainfo', { id: props.extraInfo.id, name }).catch(logError);
	}

	function onDelete() {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/extrainfo', { data: { id: props.extraInfo.id } })
			.then(() => props.onDelete(props.extraInfo.id))
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
