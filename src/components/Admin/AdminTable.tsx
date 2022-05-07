import type { ReactNode } from 'react';
import Table from 'react-bootstrap/Table';

type AdminTableProps = {
	centerText?: boolean;
	children?: ReactNode;
};

const style = { maxHeight: 600 };

export default function AdminTable(props: AdminTableProps) {
	return (
		<div className='overflow-auto' style={style}>
			<Table className={`align-middle${props.centerText ? ' text-center' : ''}`}>
				{props.children}
			</Table>
		</div>
	);
}
