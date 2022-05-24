import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import type {
	DiceResponse,
	DiceRequest,
	DiceResolverKey,
	DiceResponseResultType,
} from '../../utils/dice';
import SheetModal from './SheetModal';

export type DiceRoll = {
	dices: DiceRequest | DiceRequest[];
	resolverKey?: DiceResolverKey;
	onResult?: (result: DiceResponse[]) => void;
};

export type DiceRollResultModalProps = DiceRoll & {
	onHide: () => void;
	onRollAgain: () => void;
};

type DiceDisplay = {
	roll: number | string;
	description?: number | string;
};

export default function DiceRollResultModal(props: DiceRollResultModalProps) {
	const [diceResults, setDiceResults] = useState<DiceResponse[]>([]);
	const [descriptionFade, setDescriptionFade] = useState(false);

	const logError = useContext(ErrorLogger);

	const rollAgain = useRef(false);
	const descriptionDelayTimeout = useRef<NodeJS.Timeout | null>(null);

	const result: DiceDisplay | undefined = useMemo(() => {
		if (diceResults.length === 1) {
			return {
				roll: diceResults[0].roll,
				description: diceResults[0].resultType?.description,
			};
		} else if (diceResults.length > 1) {
			if (Array.isArray(props.dices)) {
				const dices = diceResults.map((d) => d.roll);
				const sum = dices.reduce((a, b) => a + b, 0);
				return {
					roll: sum,
					description: dices.join(' + '),
				};
			} else {
				let max: DiceResponseResultType | null = null;
				for (const result of diceResults) {
					if (
						result.resultType &&
						result.resultType.successWeight >
							(max?.successWeight || Number.MIN_SAFE_INTEGER)
					) {
						max = result.resultType;
					}
				}
				const roll = diceResults.map((d) => d.roll).join(', ');
				const description = max?.description;
				return { roll, description };
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diceResults]);

	useEffect(() => {
		if (Array.isArray(props.dices) && props.dices.length === 0) return;
		api
			.post(
				'/dice',
				{ dices: props.dices, resolverKey: props.resolverKey },
				{ timeout: 5000 }
			)
			.then((res) => {
				const results: DiceResponse[] = res.data.results;
				setDiceResults(results);
				console.log(results);
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
			show={Array.isArray(props.dices) ? props.dices.length != 0 : true}
			onExited={onExited}
			title='Resultado da Rolagem'
			onHide={onHide}
			closeButton={{ disabled: !result }}
			backdrop={!result ? 'static' : true}
			keyboard={!result ? false : true}
			centered
			applyButton={{
				name: 'Rolar Novamente',
				onApply: () => {
					rollAgain.current = true;
					onHide();
				},
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
							<Col>{result.description}</Col>
						</Fade>
					)}
				</Row>
			</Container>
		</SheetModal>
	);
}
