import type { Info } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import InfoEditorModal from '../../Modals/InfoEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

type InfoEditorContainerProps = {
	info: Info[];
	title: string;
};

export default function InfoEditorContainer(props: InfoEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [infoModal, setInfoModal] = useState<EditorModalData<Info>>({
		show: false,
		operation: 'create',
	});
	const [info, setInfo] = useState(props.info);
	const logError = useContext(ErrorLogger);

	function onModalSubmit({ id, name }: Info) {
		setLoading(true);

		const config: AxiosRequestConfig =
			infoModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name },
				  }
				: {
						method: 'POST',
						data: { id, name },
				  };

		api('/sheet/info', config)
			.then((res) => {
				if (infoModal.operation === 'create') {
					setInfo([...info, { id: res.data.id, name }]);
					return;
				}
				info[info.findIndex((info) => info.id === id)].name = name;
				setInfo([...info]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteInfo(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
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
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={6}
				outline
				title={`${props.title} (Geral)`}
				addButton={{
					onAdd: () => setInfoModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{info.map((info) => (
						<EditorRow
							key={info.id}
							name={info.name}
							onEdit={() => setInfoModal({ operation: 'edit', show: true, data: info })}
							onDelete={() => deleteInfo(info.id)}
							disabled={loading}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<InfoEditorModal
				{...infoModal}
				onHide={() => setInfoModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
		</>
	);
}
