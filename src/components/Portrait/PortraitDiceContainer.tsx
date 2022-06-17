import { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import { sleep } from '../../utils';
import type { DiceResponse } from '../../utils/dice';
import { getAttributeStyle } from '../../utils/style';

export default function PortraitDiceContainer(props: {
	socket: SocketIO;
	playerId: number;
	showDice: boolean;
	onShowDice: () => void;
	onHideDice: () => void;
	color: string;
	showDiceRoll: boolean;
}) {
	const diceQueue = useRef<DiceResponse[]>([]);
	const diceData = useRef<DiceResponse>();

	const showDiceRef = useRef(props.showDice);

	const [diceResult, setDiceResult] = useState<number | null>(null);
	const diceResultRef = useRef<HTMLDivElement>(null);
	const lastDiceResult = useRef(0);
	const [diceDescription, setDiceDescription] = useState<string | null>(null);
	const diceDescriptionRef = useRef<HTMLDivElement>(null);
	const lastDiceDescription = useRef('');

	const diceVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!props.showDiceRoll) return;
		
		const style = getAttributeStyle(props.color);

		if (diceResultRef.current) {
			diceResultRef.current.style.color = style.color;
			diceResultRef.current.style.textShadow = style.textShadow;
		}

		if (diceDescriptionRef.current) {
			diceDescriptionRef.current.style.color = style.color;
			diceDescriptionRef.current.style.textShadow = style.textShadow;
		}

		function showDiceRoll() {
			if (showDiceRef.current) return;
			showDiceRef.current = true;
			if (diceVideo.current) {
				props.onShowDice();
				diceVideo.current.currentTime = 0;
				diceVideo.current.play();
			}
		}

		async function showNextResult(result: DiceResponse) {
			showDiceRoll();
			await sleep(750);
			diceData.current = undefined;
			onDiceResult(result);
		}

		async function onDiceResult(result: DiceResponse) {
			if (diceData.current) return diceQueue.current.push(result);
			if (!showDiceRef.current) return showNextResult(result);

			diceData.current = result;

			lastDiceResult.current = result.roll;
			setDiceResult(result.roll);

			if (result.resultType) {
				lastDiceDescription.current = result.resultType.description;
				await sleep(750);
				setDiceDescription(result.resultType.description);
			}
			await sleep(1500);

			setDiceResult(null);
			setDiceDescription(null);

			await sleep(250);
			props.onHideDice();
			await sleep(600);
			showDiceRef.current = false;

			const next = diceQueue.current.shift();
			if (next) showNextResult(next);
			else diceData.current = undefined;
		}

		props.socket.on('diceRoll', showDiceRoll);
		props.socket.on('diceResult', (playerId, results, dices) => {
			if (playerId !== props.playerId) return;

			if (results.length === 1) return onDiceResult(results[0]);

			if (Array.isArray(dices)) {
				onDiceResult({
					roll: results.reduce((prev, cur) => prev + cur.roll, 0),
				});
			} else {
				if (diceData.current) return diceQueue.current.push(...results);
				const first = results.shift();
				if (!first) return;
				diceQueue.current.push(...results);
				onDiceResult(first);
			}
		});

		return () => {
			props.socket.off('diceRoll');
			props.socket.off('diceResult');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles.diceContainer}>
			<video
				muted
				className={`popout${props.showDice ? ' show' : ''} ${styles.dice}`}
				ref={diceVideo}>
				<source src='/dice_animation.webm' />
			</video>
			<Fade in={diceResult !== null}>
				<div className={styles.result} ref={diceResultRef}>
					{diceResult || lastDiceResult.current}
				</div>
			</Fade>
			<Fade in={diceDescription !== null}>
				<div className={styles.description} ref={diceDescriptionRef}>
					{diceDescription || lastDiceDescription.current}
				</div>
			</Fade>
		</div>
	);
}
