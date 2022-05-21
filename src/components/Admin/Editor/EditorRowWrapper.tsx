import { ReactNode } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function EditorRowWrapper(props: { children: ReactNode }) {
	return (
		<Row className='row-wrapper'>
			<Col>{props.children}</Col>
		</Row>
	);
}
