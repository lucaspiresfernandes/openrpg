import type { Spec } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import SpecEditorModal from '../../Modals/SpecEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

type SpecEditorContainerProps = {
	specs: Spec[];
};

export default function SpecEditorContainer(props: SpecEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [specModal, setSpecModal] = useState<EditorModalData<Spec>>({
		show: false,
		operation: 'create',
	});
	const [spec, setSpec] = useState(props.specs);
	const logError = useContext(ErrorLogger);

	function onModalSubmit({ id, name }: Spec) {
		setLoading(true);

		const config: AxiosRequestConfig =
			specModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name },
				  }
				: {
						method: 'POST',
						data: { id, name },
				  };

		api('/sheet/spec', config)
			.then((res) => {
				if (specModal.operation === 'create') {
					setSpec([...spec, { id: res.data.id, name }]);
					return;
				}
				spec[spec.findIndex((spec) => spec.id === id)].name = name;
				setSpec([...spec]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteSpec(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/spec', { data: { id } })
			.then(() => {
				const newSpec = [...spec];
				const index = newSpec.findIndex((spec) => spec.id === id);
				if (index > -1) {
					newSpec.splice(index, 1);
					setSpec(newSpec);
				}
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={6}
				outline
				title='Especificações de Personagem'
				addButton={{
					onAdd: () => setSpecModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{spec.map((spec) => (
						<EditorRow
							key={spec.id}
							name={spec.name}
							onEdit={() => setSpecModal({ operation: 'edit', show: true, data: spec })}
							onDelete={() => deleteSpec(spec.id)}
							disabled={loading}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<SpecEditorModal
				{...specModal}
				onSubmit={onModalSubmit}
				onHide={() => setSpecModal({ operation: 'create', show: false })}
				disabled={loading}
			/>
		</>
	);
}
