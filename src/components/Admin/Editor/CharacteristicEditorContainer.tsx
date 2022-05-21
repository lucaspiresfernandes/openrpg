import type { Characteristic } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import CharacteristicEditorModal from '../../Modals/CharacteristicEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

type CharacteristicEditorContainerProps = {
	characteristics: Characteristic[];
	title: string;
};

export default function CharacteristicEditorContainer(
	props: CharacteristicEditorContainerProps
) {
	const [loading, setLoading] = useState(false);
	const [characteristicModal, setCharacteristicModal] = useState<
		EditorModalData<Characteristic>
	>({
		show: false,
		operation: 'create',
	});
	const [characteristics, setCharacteristics] = useState(props.characteristics);
	const logError = useContext(ErrorLogger);

	function onModalSubmit({ id, name }: Characteristic) {
		setLoading(true);

		const config: AxiosRequestConfig =
			characteristicModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name },
				  }
				: {
						method: 'POST',
						data: { id, name },
				  };

		api('/sheet/characteristic', config)
			.then((res) => {
				if (characteristicModal.operation === 'create') {
					setCharacteristics([...characteristics, { id: res.data.id, name }]);
					return;
				}
				characteristics[characteristics.findIndex((char) => char.id === id)].name = name;
				setCharacteristics([...characteristics]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteCharacteristic(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/characteristic', { data: { id } })
			.then(() => {
				const newCharacteristic = [...characteristics];
				const index = newCharacteristic.findIndex((char) => char.id === id);
				if (index > -1) {
					newCharacteristic.splice(index, 1);
					setCharacteristics(newCharacteristic);
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
				title={props.title}
				addButton={{
					onAdd: () => setCharacteristicModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{characteristics.map((char) => (
						<EditorRow
							key={char.id}
							name={char.name}
							onEdit={() =>
								setCharacteristicModal({ operation: 'edit', show: true, data: char })
							}
							onDelete={() => deleteCharacteristic(char.id)}
							disabled={loading}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<CharacteristicEditorModal
				{...characteristicModal}
				onHide={() => setCharacteristicModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
		</>
	);
}
