import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import type { DiceRollEvent } from '../../hooks/useDiceRoll';
import { clamp } from '../../utils';
import type { ResolvedDice } from '../../utils/dice';
import SheetModal from './SheetModal';

type DiceOption = {
	num: number;
	roll: number;
};

type GeneralDiceRollModalProps = {
	show: boolean;
	onHide: () => void;
	showDiceRollResult: DiceRollEvent;
};

export default function GeneralDiceRollModal(props: GeneralDiceRollModalProps) {
	const [dices, setDices] = useState<DiceOption[]>([
		{
			num: 0,
			roll: 4,
		},
		{
			num: 0,
			roll: 6,
		},
		{
			num: 0,
			roll: 8,
		},
		{
			num: 0,
			roll: 10,
		},
		{
			num: 0,
			roll: 12,
		},
		{
			num: 0,
			roll: 20,
		},
	]);
	const applyRef = useRef(false);

	function reset() {
		const rollDices: ResolvedDice[] = [];
		dices.map((dice) => {
			if (dice.num > 0) rollDices.push({ num: dice.num, roll: dice.roll });
		});
		if (rollDices.length > 0 && applyRef.current) {
			props.showDiceRollResult(rollDices);
			applyRef.current = false;
		}
		setDices(
			dices.map((dice) => {
				dice.num = 0;
				return dice;
			})
		);
	}

	function setDice(index: number, coeff: number) {
		setDices(
			dices.map((dice, i) => {
				if (i === index) dice.num = clamp(dice.num + coeff, 0, 9);
				return dice;
			})
		);
	}

	return (
		<SheetModal
			show={props.show}
			onExited={reset}
			title='Rolagem Geral de Dados'
			applyButton={{
				name: 'Rolar',
				onApply: () => {
					applyRef.current = true;
					props.onHide();
				},
			}}
			onHide={props.onHide}
			centered>
			<Container fluid>
				<Row className='text-center'>
					{dices.map((dice, index) => (
						<Col xs={6} lg={4} key={index} className='my-2'>
							<Row className='mb-1 justify-content-center'>
								<Col>
									<Image
										src={`/dice${dice.roll}.png`}
										alt={`${dice.num || ''}D${dice.roll}`}
										title={`${dice.num || ''}D${dice.roll}`}
										style={{ maxHeight: 75 }}
									/>
								</Col>
							</Row>
							<Row className='justify-content-center'>
								<Col xs='auto'>
									<Button variant='secondary' onClick={() => setDice(index, -1)}>
										-
									</Button>
								</Col>
								<Col xs='auto' className='align-self-center'>
									{dice.num}
								</Col>
								<Col xs='auto'>
									<Button variant='secondary' onClick={() => setDice(index, 1)}>
										+
									</Button>
								</Col>
							</Row>
						</Col>
					))}
				</Row>
			</Container>
		</SheetModal>
	);
}
