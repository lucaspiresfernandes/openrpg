import type { ExtraInfo } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import ExtraInfoEditorModal from '../../Modals/ExtraInfoEditorModal';
import EditorContainer from './EditorContainer';

type ExtraInfoEditorContainerProps = {
	extraInfo: ExtraInfo[];
	title: string;
};

export default function ExtraInfoEditorContainer(props: ExtraInfoEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [infoModal, setInfoModal] = useState<EditorModalData<ExtraInfo>>({
		show: false,
		operation: 'create',
	});
	const [extraInfo, setExtraInfo] = useState(props.extraInfo);
	const logError = useContext(ErrorLogger);

	function modalSubmit({ id, name }: ExtraInfo) {
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

		api('/sheet/extrainfo', config)
			.then((res) => {
				if (infoModal.operation === 'create') {
					setExtraInfo([...extraInfo, { id: res.data.id, name }]);
					return;
				}
				extraInfo[extraInfo.findIndex((info) => info.id === id)].name = name;
				setExtraInfo([...extraInfo]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteExtraInfo(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
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
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={12}
				lg={6}
				outline
				title={`${props.title} (Extra)`}
				addButton={{
					onAdd: () => setInfoModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={extraInfo}
					onEdit={(id) =>
						setInfoModal({
							operation: 'edit',
							show: true,
							data: extraInfo.find((info) => info.id === id),
						})
					}
					onDelete={(id) => deleteExtraInfo(id)}
					disabled={loading}
				/>
			</DataContainer>
			<ExtraInfoEditorModal
				{...infoModal}
				onHide={() => setInfoModal({ operation: 'create', show: false })}
				onSubmit={modalSubmit}
				disabled={loading}
			/>
		</>
	);
}
