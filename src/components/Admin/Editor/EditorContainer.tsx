import type { CSSProperties } from 'react';
import { FixedSizeList } from 'react-window';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CustomSpinner from '../../CustomSpinner';
import { BsPencil, BsTrash } from 'react-icons/bs';

export default function EditorContainer({
	data,
	onEdit,
	onDelete,
	disabled,
}: {
	data: { id: number; name: string }[];
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	disabled?: boolean;
}) {
	const DataRow = ({ index, style }: { index: number; style: CSSProperties }) => (
		<EditorRow
			style={style}
			id={data[index].id}
			name={data[index].name}
			onDelete={onDelete}
			onEdit={onEdit}
			disabled={disabled}
		/>
	);

	return (
		<Row>
			<Col>
				<FixedSizeList
					height={294}
					width='100%'
					itemSize={50}
					itemCount={data.length}
					className='editor-container'>
					{DataRow}
				</FixedSizeList>
			</Col>
		</Row>
	);
}

type EditorRowProps = {
	id: number;
	name: string;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	disabled?: boolean;
	style: CSSProperties;
};

function EditorRow(props: EditorRowProps) {
	return (
		<Row style={props.style}>
			<Col xs='auto' className='align-self-center'>
				<Button
					onClick={(ev) => {
						ev.currentTarget.blur();
						props.onDelete(props.id);
					}}
					size='sm'
					variant='secondary'
					aria-label='Apagar'
					disabled={props.disabled}>
					{props.disabled ? <CustomSpinner /> : <BsTrash color='white' size='1.5rem' />}
				</Button>
			</Col>
			<Col xs='auto' className='ps-0 align-self-center'>
				<Button
					onClick={(ev) => {
						ev.currentTarget.blur();
						props.onEdit(props.id);
					}}
					size='sm'
					variant='secondary'
					aria-label='Editar'
					disabled={props.disabled}>
					{props.disabled ? <CustomSpinner /> : <BsPencil color='white' size='1.5rem' />}
				</Button>
			</Col>
			<Col className='ps-0 align-self-center'>
				<label className='w-100 border-bottom border-secondary'>{props.name}</label>
			</Col>
		</Row>
	);
}
