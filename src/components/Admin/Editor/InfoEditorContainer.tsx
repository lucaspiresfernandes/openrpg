import type { Info } from '@prisma/client';
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
import CreateInfoModal from '../../Modals/CreateInfoModal';
import AdminTable from '../AdminTable';

type InfoEditorContainerProps = {
	info: Info[];
	title: string;
};

export default function InfoEditorContainer(props: InfoEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [loading, setLoading] = useState(false);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [info, setInfo] = useState(props.info);

	function createInfo(name: string) {
		setLoading(true);
		api
			.put('/sheet/info', { name })
			.then((res) => {
				const id = res.data.id;
				setInfo([...info, { id, name, default: false }]);
			})
			.catch(logError)
			.finally(() => {
				setShowInfoModal(false);
				setLoading(false);
			});
	}

	function deleteInfo(id: number) {
		const newInfo = [...info];
		const index = newInfo.findIndex((info) => info.id === id);
		if (index > -1) {
			newInfo.splice(index, 1);
			setInfo(newInfo);
		}
	}

	return (
		<>
			<DataContainer
				outline
				title={`${props.title} (Geral)`}
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
								{info.map((info) => (
									<InfoEditorField key={info.id} {...info} onDelete={deleteInfo} />
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
				disabled={loading}
			/>
		</>
	);
}

type InfoEditorFieldProps = {
	id: number;
	name: string;
	default: boolean;
	onDelete(id: number): void;
};

function InfoEditorField(props: InfoEditorFieldProps) {
	const [loading, setLoading] = useState(false);
	const [lastName, name, setName] = useExtendedState(props.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/info', { id: props.id, name }).catch(logError);
	}

	function onDelete() {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/info', { data: { id: props.id } })
			.then(() => props.onDelete(props.id))
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<tr>
			<td>
				{!props.default && (
					<Button onClick={onDelete} size='sm' variant='secondary' disabled={loading}>
						{loading ? <CustomSpinner /> : <BsTrash color='white' size='1.5rem' />}
					</Button>
				)}
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
					readOnly={props.default}
					disabled={props.default || loading}
				/>
			</td>
		</tr>
	);
}
