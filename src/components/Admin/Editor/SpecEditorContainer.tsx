import type { Spec } from '@prisma/client';
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
import CreateSpecModal from '../../Modals/CreateSpecModal';
import AdminTable from '../AdminTable';

type SpecEditorContainerProps = {
	specs: Spec[];
};

export default function SpecEditorContainer(props: SpecEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [showSpecModal, setShowSpecModal] = useState(false);
	const [spec, setSpec] = useState(props.specs);
	const logError = useContext(ErrorLogger);

	function createSpec(name: string) {
		setLoading(true);
		api
			.put('/sheet/spec', { name })
			.then((res) => {
				const id = res.data.id;
				setSpec([...spec, { id, name }]);
			})
			.catch(logError)
			.finally(() => {
				setShowSpecModal(false);
				setLoading(false);
			});
	}

	function deleteSpec(id: number) {
		const newSpec = [...spec];
		const index = newSpec.findIndex((spec) => spec.id === id);
		if (index > -1) {
			newSpec.splice(index, 1);
			setSpec(newSpec);
		}
	}

	return (
		<>
			<DataContainer
				outline
				title='Especificações de Personagem'
				addButton={{ onAdd: () => setShowSpecModal(true), disabled: loading }}>
				<Row>
					<Col>
						<AdminTable>
							<thead>
								<tr>
									<th></th>
									<th title='Nome da Especificação de Personagem.'>Nome</th>
								</tr>
							</thead>
							<tbody>
								{spec.map((spec) => (
									<SpecEditorField key={spec.id} spec={spec} onDelete={deleteSpec} />
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateSpecModal
				show={showSpecModal}
				onHide={() => setShowSpecModal(false)}
				onCreate={createSpec}
				disabled={loading}
			/>
		</>
	);
}

type SpecEditorFieldProps = {
	spec: Spec;
	onDelete(id: number): void;
};

function SpecEditorField(props: SpecEditorFieldProps) {
	const [loading, setLoading] = useState(false);
	const [lastName, name, setName] = useExtendedState(props.spec.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/spec', { id: props.spec.id, name }).catch(logError);
	}

	function onDelete() {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/spec', { data: { id: props.spec.id } })
			.then(() => props.onDelete(props.spec.id))
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
