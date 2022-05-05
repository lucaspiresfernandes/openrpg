import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormSelect from 'react-bootstrap/FormSelect';
import SheetModal from './SheetModal';

type AddDataModalProps = {
	show: boolean;
	onHide: () => void;
	onAddData: (id: number) => void;
	data: { id: number; name: string }[];
	title: string;
	disabled?: boolean;
};

export default function AddDataModal(props: AddDataModalProps) {
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (props.data.length > 0) setValue(props.data[0].id);
		else setValue(0);
	}, [props.data]);

	return (
		<SheetModal
			title={props.title}
			show={props.show}
			onHide={props.onHide}
			applyButton={{
				name: 'Adicionar',
				onApply: () => props.onAddData(value),
				disabled: props.data.length === 0 || props.disabled,
			}}>
			<Container fluid>
				<FormSelect
					className='theme-element'
					value={value}
					onChange={(ev) => setValue(parseInt(ev.currentTarget.value))}
					disabled={props.data.length === 0}>
					{props.data.map((eq) => (
						<option key={eq.id} value={`${eq.id}`}>
							{eq.name}
						</option>
					))}
				</FormSelect>
			</Container>
		</SheetModal>
	);
}
