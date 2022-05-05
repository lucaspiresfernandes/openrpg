import type { Currency } from '@prisma/client';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import CustomSpinner from '../../CustomSpinner';
import DataContainer from '../../DataContainer';
import CreateCurrencyModal from '../../Modals/CreateCurrencyModal';
import AdminTable from '../AdminTable';

type CurrencyEditorContainerProps = {
	currencies: Currency[];
};

export default function CurrencyEditorContainer(props: CurrencyEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [showCurrencyModal, setShowCurrencyModal] = useState(false);
	const [currency, setCurrency] = useState(props.currencies);
	const logError = useContext(ErrorLogger);

	function createCurrency(name: string) {
		setLoading(true);
		api
			.put('/sheet/currency', { name })
			.then((res) => {
				const id = res.data.id;
				setCurrency([...currency, { id, name }]);
			})
			.catch(logError)
			.finally(() => {
				setShowCurrencyModal(false);
				setLoading(false);
			});
	}

	function deleteCurrency(id: number) {
		const newCurrency = [...currency];
		const index = newCurrency.findIndex((currency) => currency.id === id);
		if (index > -1) {
			newCurrency.splice(index, 1);
			setCurrency(newCurrency);
		}
	}

	return (
		<>
			<DataContainer
				outline
				title='Moedas'
				addButton={{ onAdd: () => setShowCurrencyModal(true), disabled: loading }}>
				<Row>
					<Col>
						<AdminTable>
							<thead>
								<tr>
									<th></th>
									<th title='Nome da Moeda.'>Nome</th>
								</tr>
							</thead>
							<tbody>
								{currency.map((currency) => (
									<CurrencyEditorField
										key={currency.id}
										currency={currency}
										onDelete={deleteCurrency}
									/>
								))}
							</tbody>
						</AdminTable>
					</Col>
				</Row>
			</DataContainer>
			<CreateCurrencyModal
				show={showCurrencyModal}
				onHide={() => setShowCurrencyModal(false)}
				onCreate={createCurrency}
				disabled={loading}
			/>
		</>
	);
}

type CurrencyEditorFieldProps = {
	currency: Currency;
	onDelete(id: number): void;
};

function CurrencyEditorField(props: CurrencyEditorFieldProps) {
	const [loading, setLoading] = useState(false);
	const [lastName, name, setName] = useExtendedState(props.currency.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/currency', { id: props.currency.id, name }).catch(logError);
	}

	function onDelete() {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/currency', { data: { id: props.currency.id } })
			.then(() => props.onDelete(props.currency.id))
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<tr>
			<td>
				<Button
					onClick={onDelete}
					size='sm'
					variant='secondary'
					disabled={loading}>
					{loading ? <CustomSpinner /> : <BsTrash color='white' size='1.5rem' />}
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
					disabled={loading}
				/>
			</td>
		</tr>
	);
}
