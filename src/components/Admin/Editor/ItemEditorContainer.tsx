import type { Item } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import ItemEditorModal from '../../Modals/ItemEditorModal';
import EditorContainer from './EditorContainer';

type ItemEditorContainerProps = {
	items: Item[];
	title: string;
};

export default function ItemEditorContainer(props: ItemEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [itemModal, setItemModal] = useState<EditorModalData<Item>>({
		show: false,
		operation: 'create',
	});
	const [item, setItem] = useState(props.items);
	const logError = useContext(ErrorLogger);

	function onModalSubmit(it: Item) {
		if (!it.name || !it.description)
			return alert(
				'Nenhum campo pode ser vazio. Para definir um campo vazio, utilize "-"'
			);

		setLoading(true);

		const config: AxiosRequestConfig =
			itemModal.operation === 'create'
				? {
						method: 'PUT',
						data: { ...it, id: undefined },
				  }
				: {
						method: 'POST',
						data: it,
				  };

		api('/sheet/item', config)
			.then((res) => {
				if (itemModal.operation === 'create') {
					setItem([...item, { ...it, id: res.data.id }]);
					return;
				}
				item[item.findIndex((eq) => eq.id === it.id)] = it;
				setItem([...item]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteItem(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/item', { data: { id } })
			.then(() => {
				item.splice(
					item.findIndex((eq) => eq.id === id),
					1
				);
				setItem([...item]);
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
				title={props.title}
				addButton={{
					onAdd: () => setItemModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={item}
					onEdit={(id) =>
						setItemModal({
							operation: 'edit',
							show: true,
							data: item.find((it) => it.id === id),
						})
					}
					onDelete={(id) => deleteItem(id)}
					disabled={loading}
				/>
			</DataContainer>
			<ItemEditorModal
				{...itemModal}
				onHide={() => setItemModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
		</>
	);
}
