import type { ReactNode } from 'react';
import Table from 'react-bootstrap/Table';

type AdminTableProps = {
	centerText?: boolean;
	children?: ReactNode;
};

export default function AdminTable(props: AdminTableProps) {
	return (
		<div className='overflow-auto' style={{ maxHeight: 600 }}>
			<Table className={`align-middle${props.centerText ? ' text-center' : ''}`}>
				{props.children}
			</Table>
		</div>
	);
}
