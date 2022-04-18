import { useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { ResolvedDice } from '../../utils';
import DataContainer from '../DataContainer';
import DiceRollResultModal from '../Modals/DiceRollResultModal';
import GeneralDiceRollModal from '../Modals/GeneralDiceRollModal';

export default function AdminDiceRollContainer() {
	const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);
	const [diceRoll, setDiceRoll] = useState<{
		dices: ResolvedDice[];
		resolverKey?: string;
	}>({ dices: [] });
	const lastRoll = useRef<{ dices: ResolvedDice[]; resolverKey?: string }>({ dices: [] });

	function onDiceRoll(dices: ResolvedDice[], resolverKey?: string) {
		const roll = { dices, resolverKey };
		lastRoll.current = roll;
		setDiceRoll(roll);
	}

	return (
		<>
			<DataContainer xs={12} lg title='Rolagem'>
				<Row className='mb-3 justify-content-center'>
					<Col xs={3}>
						<Row>
							<Col className='h5'>Geral</Col>
						</Row>
						<Row>
							<Image
								fluid
								src='/dice20.png'
								alt='Dado'
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
				showDiceRollResult={onDiceRoll}
			/>
			<DiceRollResultModal
				dices={diceRoll.dices}
				resolverKey={diceRoll.resolverKey}
				onHide={() => setDiceRoll({ dices: [], resolverKey: '' })}
				onRollAgain={() => setDiceRoll(lastRoll.current)}
			/>
		</>
	);
}
