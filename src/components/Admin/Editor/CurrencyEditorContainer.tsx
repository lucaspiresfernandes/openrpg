import type { Currency } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import CurrencyEditorModal from '../../Modals/CurrencyEditorModal';
import EditorContainer from './EditorContainer';

type CurrencyEditorContainerProps = {
	currencies: Currency[];
};

export default function CurrencyEditorContainer(props: CurrencyEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [currencyModal, setCurrencyModal] = useState<EditorModalData<Currency>>({
		show: false,
		operation: 'create',
	});
	const [currency, setCurrency] = useState(props.currencies);
	const logError = useContext(ErrorLogger);

	function onModalSubmit({ id, name, visibleToAdmin }: Currency) {
		setLoading(true);

		const config: AxiosRequestConfig =
			currencyModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name, visibleToAdmin },
				  }
				: {
						method: 'POST',
						data: { id, name, visibleToAdmin },
				  };

		api('/sheet/currency', config)
			.then((res) => {
				if (currencyModal.operation === 'create') {
					setCurrency([...currency, { id: res.data.id, name, visibleToAdmin }]);
					return;
				}
				currency[currency.findIndex((cur) => cur.id === id)] = {
					id,
					name,
					visibleToAdmin,
				};
				setCurrency([...currency]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteCurrency(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/currency', { data: { id } })
			.then(() => {
				currency.splice(
					currency.findIndex((cur) => cur.id === id),
					1
				);
				setCurrency([...currency]);
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
				title='Moedas'
				addButton={{
					onAdd: () => setCurrencyModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorContainer
					data={currency}
					onEdit={(id) =>
						setCurrencyModal({
							operation: 'edit',
							show: true,
							data: currency.find((cur) => cur.id === id),
						})
					}
					onDelete={(id) => deleteCurrency(id)}
					disabled={loading}
				/>
			</DataContainer>
			<CurrencyEditorModal
				{...currencyModal}
				onHide={() => setCurrencyModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
		</>
	);
}
