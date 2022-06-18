import type { Attribute, AttributeStatus } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import AttributeEditorModal from '../../Modals/AttributeEditorModal';
import AttributeStatusEditorModal from '../../Modals/AttributeStatusEditorModal';
import EditorContainer from './EditorContainer';

type AttributeEditorContainerProps = {
	attributes: Attribute[];
	attributeStatus: AttributeStatus[];
};

export default function AttributeEditorContainer(props: AttributeEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [attributeModal, setAttributeModal] = useState<EditorModalData<Attribute>>({
		operation: 'create',
		show: false,
	});
	const [attributes, setAttributes] = useState(
		props.attributes.map((attr) => ({
			...attr,
			color: `#${attr.color}`,
		}))
	);
	const logError = useContext(ErrorLogger);

	function onAttributeModalSubmit({
		id,
		name,
		rollable,
		color,
		portrait,
		visibleToAdmin,
	}: Attribute) {
		setLoading(true);
		const dbColor = color.substring(1, color.length);

		const config: AxiosRequestConfig =
			attributeModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, rollable, color: dbColor, visibleToAdmin },
				  }
				: {
						method: 'POST',
						data: { id, name, rollable, color: dbColor, visibleToAdmin },
				  };

		api('/sheet/attribute', config)
			.then((res) => {
				if (attributeModal.operation === 'create') {
					setAttributes([
						...attributes,
						{ id: res.data.id, name, rollable, color, portrait, visibleToAdmin },
					]);
					return;
				}
				attributes[attributes.findIndex((attr) => attr.id === id)] = {
					id,
					name,
					rollable,
					color,
					portrait,
					visibleToAdmin,
				};
				setAttributes([...attributes]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteAttribute(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/attribute', { data: { id } })
			.then(() => {
				const newAttribute = [...attributes];
				const index = newAttribute.findIndex((attr) => attr.id === id);
				if (index > -1) {
					newAttribute.splice(index, 1);
					setAttributes(newAttribute);
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
				title='Barras de Atributo'
				addButton={{
					onAdd: () => setAttributeModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={attributes}
					onEdit={(id) =>
						setAttributeModal({
							operation: 'edit',
							show: true,
							data: attributes.find((attr) => attr.id === id),
						})
					}
					onDelete={(id) => deleteAttribute(id)}
					disabled={loading}
				/>
			</DataContainer>
			<AttributeEditorModal
				{...attributeModal}
				onSubmit={onAttributeModalSubmit}
				onHide={() => setAttributeModal({ operation: 'create', show: false })}
				disabled={loading}
			/>
			<AttributeStatusEditorContainer
				attributeStatus={props.attributeStatus}
				attributes={attributes}
			/>
		</>
	);
}

type AttributeStatusEditorContainerProps = {
	attributes: Attribute[];
	attributeStatus: AttributeStatus[];
};

function AttributeStatusEditorContainer(props: AttributeStatusEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [attributeStatusModal, setAttributeStatusModal] = useState<
		EditorModalData<AttributeStatus>
	>({
		operation: 'create',
		show: false,
	});
	const [attributeStatus, setAttributeStatus] = useState(props.attributeStatus);
	const logError = useContext(ErrorLogger);

	function onAttributeStatusModalSubmit({ id, name, attribute_id }: AttributeStatus) {
		setLoading(true);

		const config: AxiosRequestConfig =
			attributeStatusModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, attribute_id },
				  }
				: {
						method: 'POST',
						data: { id, name, attribute_id },
				  };

		api('/sheet/attribute/status', config)
			.then((res) => {
				if (attributeStatusModal.operation === 'create') {
					setAttributeStatus([
						...attributeStatus,
						{ id: res.data.id, name, attribute_id },
					]);
					return;
				}
				attributeStatus[attributeStatus.findIndex((attr) => attr.id === id)] = {
					id,
					name,
					attribute_id,
				};
				setAttributeStatus([...attributeStatus]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteAttributeStatus(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/attribute/status', { data: { id } })
			.then(() => {
				const newAttributeStatus = [...attributeStatus];
				const index = newAttributeStatus.findIndex((status) => status.id === id);
				if (index > -1) {
					newAttributeStatus.splice(index, 1);
					setAttributeStatus(newAttributeStatus);
				}
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				outline
				xs={12}
				lg={6}
				title='Status de Atributos'
				addButton={{
					onAdd: () => setAttributeStatusModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={attributeStatus}
					onEdit={(id) =>
						setAttributeStatusModal({
							operation: 'edit',
							show: true,
							data: attributeStatus.find((stat) => stat.id === id),
						})
					}
					onDelete={(id) => deleteAttributeStatus(id)}
					disabled={loading}
				/>
			</DataContainer>
			<AttributeStatusEditorModal
				{...attributeStatusModal}
				onSubmit={onAttributeStatusModalSubmit}
				onHide={() => setAttributeStatusModal({ operation: 'create', show: false })}
				attributes={props.attributes}
				disabled={loading}
			/>
		</>
	);
}
