import Image from 'next/image';
import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DataContainer from '../DataContainer';
import GeneralDiceRollModal from '../Modals/GeneralDiceRollModal';

export default function AdminDiceRollContainer() {
	const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);
	return (
		<>
			<DataContainer xs={12} lg className='mb-5 mb-lg-0' title='Rolagem'>
				<Row className='mb-3 justify-content-center'>
					<Col xs={3}>
						<Row>
							<Col className='h5'>Geral</Col>
						</Row>
						<Row>
							<Image
								src='/dice20.webp'
								alt='Dado'
								width={200}
								height={200}
								className='clickable'
								onClick={() => setGeneralDiceRollShow(true)}
							/>
						</Row>
					</Col>
				</Row>
			</DataContainer>
			<GeneralDiceRollModal
				show={generalDiceRollShow}
				onHide={() => setGeneralDiceRollShow(false)}
			/>
		</>
	);
}
