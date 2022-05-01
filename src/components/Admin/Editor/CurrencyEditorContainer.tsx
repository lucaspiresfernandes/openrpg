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
import DataContainer from '../../DataContainer';
import CreateCurrencyModal from '../../Modals/CreateCurrencyModal';
import AdminTable from '../AdminTable';

type CurrencyEditorContainerProps = {
	currencies: Currency[];
	disabled?: boolean;
};

export default function CurrencyEditorContainer(props: CurrencyEditorContainerProps) {
	const logError = useContext(ErrorLogger);
	const [showCurrencyModal, setShowCurrencyModal] = useState(false);
	const [currency, setCurrency] = useState(props.currencies);

	function createCurrency(name: string) {
		api
			.put('/sheet/currency', { name })
			.then((res) => {
				const id = res.data.id;
				setCurrency([...currency, { id, name }]);
			})
			.catch(logError);
	}

	function deleteCurrency(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		api
			.delete('/sheet/currency', { data: { id } })
			.then(() => {
				const newCurrency = [...currency];
				const index = newCurrency.findIndex((currency) => currency.id === id);
				if (index > -1) {
					newCurrency.splice(index, 1);
					setCurrency(newCurrency);
				}
			})
			.catch(logError);
	}

	return (
		<>
			<DataContainer
				outline
				title='Moedas'
				addButton={{ onAdd: () => setShowCurrencyModal(true), disabled: props.disabled }}>
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
										deleteDisabled={props.disabled}
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
			/>
		</>
	);
}

type CurrencyEditorFieldProps = {
	currency: Currency;
	deleteDisabled?: boolean;
	onDelete(id: number): void;
};

function CurrencyEditorField(props: CurrencyEditorFieldProps) {
	const [lastName, name, setName] = useExtendedState(props.currency.name);
	const logError = useContext(ErrorLogger);

	function onBlur() {
		if (name === lastName) return;
		setName(name);
		api.post('/sheet/currency', { id: props.currency.id, name }).catch(logError);
	}

	return (
		<tr>
			<td>
				<Button
					onClick={() => props.onDelete(props.currency.id)}
					size='sm'
					variant='secondary'
					disabled={props.deleteDisabled}>
					<BsTrash color='white' size={24} />
				</Button>
			</td>
			<td>
				<BottomTextInput
					value={name}
					onChange={(ev) => setName(ev.currentTarget.value)}
					onBlur={onBlur}
				/>
			</td>
		</tr>
	);
}
