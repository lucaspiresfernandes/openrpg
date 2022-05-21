import type { Currency } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import CurrencyEditorModal from '../../Modals/CurrencyEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

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

	function onModalSubmit({ id, name }: Currency) {
		setLoading(true);

		const config: AxiosRequestConfig =
			currencyModal.operation === 'create'
				? {
						method: 'PUT',
						data: { name },
				  }
				: {
						method: 'POST',
						data: { id, name },
				  };

		api('/sheet/currency', config)
			.then((res) => {
				if (currencyModal.operation === 'create') {
					setCurrency([...currency, { id: res.data.id, name }]);
					return;
				}
				currency[currency.findIndex((cur) => cur.id === id)].name = name;
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
				xs={6}
				outline
				title='Moedas'
				addButton={{
					onAdd: () => setCurrencyModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{currency.map((curr) => (
						<EditorRow
							key={curr.id}
							name={curr.name}
							onEdit={() =>
								setCurrencyModal({ operation: 'edit', show: true, data: curr })
							}
							onDelete={() => deleteCurrency(curr.id)}
							disabled={loading}
						/>
					))}
				</EditorRowWrapper>
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
