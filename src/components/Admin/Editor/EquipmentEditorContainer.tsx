import type { Equipment } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import EquipmentEditorModal from '../../Modals/EquipmentEditorModal';
import EditorContainer from './EditorContainer';

type EquipmentEditorContainerProps = {
	equipments: Equipment[];
	title: string;
};

export default function EquipmentEditorContainer(props: EquipmentEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [equipmentModal, setEquipmentModal] = useState<EditorModalData<Equipment>>({
		show: false,
		operation: 'create',
	});
	const [equipment, setEquipment] = useState(props.equipments);
	const logError = useContext(ErrorLogger);

	function onModalSubmit(equip: Equipment) {
		if (!equip.name || !equip.attacks || !equip.damage || !equip.range || !equip.type)
			return alert(
				'Nenhum campo pode ser vazio. Para definir um campo vazio, utilize "-"'
			);

		setLoading(true);

		const config: AxiosRequestConfig =
			equipmentModal.operation === 'create'
				? {
						method: 'PUT',
						data: { ...equip, id: undefined },
				  }
				: {
						method: 'POST',
						data: equip,
				  };

		api('/sheet/equipment', config)
			.then((res) => {
				if (equipmentModal.operation === 'create') {
					setEquipment([...equipment, { ...equip, id: res.data.id }]);
					return;
				}
				equipment[equipment.findIndex((eq) => eq.id === equip.id)] = equip;
				setEquipment([...equipment]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteEquipment(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/equipment', { data: { id } })
			.then(() => {
				equipment.splice(
					equipment.findIndex((eq) => eq.id === id),
					1
				);
				setEquipment([...equipment]);
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
					onAdd: () => setEquipmentModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={equipment}
					onEdit={(id) =>
						setEquipmentModal({
							operation: 'edit',
							show: true,
							data: equipment.find((eq) => eq.id === id),
						})
					}
					onDelete={(id) => deleteEquipment(id)}
					disabled={loading}
				/>
			</DataContainer>
			<EquipmentEditorModal
				{...equipmentModal}
				onHide={() => setEquipmentModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
		</>
	);
}
