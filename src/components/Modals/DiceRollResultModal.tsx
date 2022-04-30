import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import { DiceResult, ResolvedDice } from '../../utils/dice';
import SheetModal from './SheetModal';

export type DiceRoll = {
	dices: ResolvedDice[];
	resolverKey?: string;
	onResult?: (result: DiceResult[]) => void;
};

export type DiceRollResultModalProps = DiceRoll & {
	onHide(): void;
	onRollAgain(): void;
};

export default function DiceRollResultModal(props: DiceRollResultModalProps) {
	const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
	const [descriptionFade, setDescriptionFade] = useState(false);

	const logError = useContext(ErrorLogger);

	const rollAgain = useRef(false);
	const descriptionDelayTimeout = useRef<NodeJS.Timeout | null>(null);

	const result = useMemo(() => {
		if (diceResults.length === 1) return diceResults[0];
		else if (diceResults.length > 1) {
			const dices = diceResults.map((d) => d.roll);
			const sum = dices.reduce((a, b) => a + b, 0);
			return {
				roll: sum,
				resultType: {
					description: dices.join(' + '),
					isSuccess: false,
				},
			};
		}
	}, [diceResults]);

	useEffect(() => {
		if (props.dices.length === 0) return;
		api
			.post(
				'/dice',
				{ dices: props.dices, resolverKey: props.resolverKey },
				{ timeout: 5000 }
			)
			.then((res) => {
				const results: DiceResult[] = res.data.results;
				setDiceResults(results);
				if (props.onResult) props.onResult(results);
			})
			.catch(logError);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.dices]);

	useEffect(() => {
		if (result && (diceResults.length > 1 || diceResults[0].resultType))
			descriptionDelayTimeout.current = setTimeout(() => setDescriptionFade(true), 750);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diceResults]);

	function onHide() {
		if (descriptionDelayTimeout.current) {
			clearTimeout(descriptionDelayTimeout.current);
			descriptionDelayTimeout.current = null;
		}
		props.onHide();
	}

	function onExited() {
		setDiceResults([]);
		setDescriptionFade(false);
		if (rollAgain.current) props.onRollAgain();
		rollAgain.current = false;
	}

	return (
		<SheetModal
			show={props.dices.length != 0}
			onExited={onExited}
			title='Resultado da Rolagem'
			onHide={onHide}
			closeButton={{ disabled: !result }}
			backdrop={!result ? 'static' : true}
			keyboard={!result ? false : true}
			centered
			applyButton={{
				name: 'Rolar Novamente',
				onApply: () => (rollAgain.current = true),
				disabled: !result,
			}}
			bodyStyle={{ minHeight: 120, display: 'flex', alignItems: 'center' }}>
			<Container fluid className='text-center'>
				{!result && (
					<Row>
						<Col>
							<Spinner animation='border' variant='secondary' />
						</Col>
					</Row>
				)}
				<Row>
					{result && (
						<Fade in appear>
							<Col className={result.roll ? 'h1 m-0' : ''}>{result.roll}</Col>
						</Fade>
					)}
				</Row>
				<Row>
					{result && (
						<Fade in={descriptionFade}>
							<Col>{result.resultType?.description}</Col>
						</Fade>
					)}
				</Row>
			</Container>
		</SheetModal>
	);
}
