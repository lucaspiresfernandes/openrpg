import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type PlayerAttributeEditorModalProps = {
	value: { id: number; value: number; maxValue: number; show: boolean };
	onHide: () => void;
	onSubmit: (value: number, maxValue: number) => void;
	disabled?: boolean;
};

export default function PlayerAttributeEditorModal(
	props: PlayerAttributeEditorModalProps
) {
	const [value, setValue] = useState('0');
	const [maxValue, setMaxValue] = useState('0');

	useEffect(() => {
		if (props.value.id > 0) {
			setValue(props.value.value.toString());
			setMaxValue(props.value.maxValue.toString());
		}
	}, [props.value]);

	return (
		<SheetModal
			title='Editar Atributo'
			centered
			show={props.value.show}
			onHide={props.onHide}
			applyButton={{
				name: 'Adicionar',
				onApply: () => props.onSubmit(parseInt(value) || 0, parseInt(maxValue) || 0),
				disabled: props.disabled,
			}}>
			<Container fluid>
				<FormGroup controlId='attributeEditorValue' className='mb-3'>
					<FormLabel>Valor Atual:</FormLabel>
					<FormControl
						type='number'
						className='theme-element'
						value={value}
						onChange={(ev) => setValue(ev.currentTarget.value)}
					/>
				</FormGroup>
				<FormGroup controlId='attributeEditorMaxValue'>
					<FormLabel>Valor Máximo:</FormLabel>
					<FormControl
						type='number'
						className='theme-element'
						value={maxValue}
						onChange={(ev) => setMaxValue(ev.currentTarget.value)}
					/>
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
