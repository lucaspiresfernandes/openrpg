import type { Info } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import InfoEditorModal from '../../Modals/InfoEditorModal';
import EditorContainer from './EditorContainer';

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

	function onModalSubmit({ id, name, visibleToAdmin }: Info) {
		setLoading(true);

		const config: AxiosRequestConfig =
			infoModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, visibleToAdmin },
				  }
				: {
						method: 'POST',
						data: { id, name, visibleToAdmin },
				  };

		api('/sheet/info', config)
			.then((res) => {
				if (infoModal.operation === 'create') {
					setInfo([...info, { id: res.data.id, name, visibleToAdmin }]);
					return;
				}
				info[info.findIndex((info) => info.id === id)] = {
					id,
					name,
					visibleToAdmin,
				};
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
				xs={12}
				lg={6}
				outline
				title={`${props.title} (Geral)`}
				addButton={{
					onAdd: () => setInfoModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={info}
					onEdit={(id) =>
						setInfoModal({
							operation: 'edit',
							show: true,
							data: info.find((i) => i.id === id),
						})
					}
					onDelete={(id) => deleteInfo(id)}
					disabled={loading}
				/>
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
