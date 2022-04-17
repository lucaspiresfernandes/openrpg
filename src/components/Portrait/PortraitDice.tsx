import { useEffect, useRef, useState } from 'react';
import { SocketIO } from '../../hooks/useSocket';
import { DiceResult, sleep } from '../../utils';
import Fade from 'react-bootstrap/Fade';
import styles from '../../styles/modules/Portrait.module.scss';

export default function PortraitDice(props: {
	socket: SocketIO | null;
	playerId: number;
	showDice: boolean;
	onShowDice(): void;
	onHideDice(): void;
}) {
	const diceQueue = useRef<DiceResult[]>([]);
	const diceData = useRef<DiceResult>();

	const showDiceRef = useRef(props.showDice);

	const [diceResult, setDiceResult] = useState<number | null>(null);
	const lastDiceResult = useRef(0);
	const [diceDescription, setDiceDescription] = useState<string | null>(null);
	const lastDiceDescription = useRef('');

	const diceVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const socket = props.socket;

		if (!socket) return;

		function showDiceRoll() {
			if (showDiceRef.current) return;
			showDiceRef.current = true;
			if (diceVideo.current) {
				props.onShowDice();
				diceVideo.current.currentTime = 0;
				diceVideo.current.play();
			}
		}

		async function showNextResult(result: DiceResult) {
			showDiceRoll();
			await sleep(1000);
			diceData.current = undefined;
			onDiceResult(result);
		}

		async function onDiceResult(result: DiceResult) {
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

		socket.on('diceRoll', showDiceRoll);
		socket.on('diceResult', (playerId, results) => {
			if (playerId !== props.playerId) return;
			if (results.length === 1) onDiceResult(results[0]);
			else if (results.length > 1) {
				const rolls = results.map((result) => result.roll);
				onDiceResult({
					roll: rolls.reduce((prev, cur) => prev + cur, 0),
					resultType: {
						description: rolls.join(' + '),
						isSuccess: true,
					},
				});
			}
		});

		return () => {
			socket.off('diceRoll');
			socket.off('diceResult');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	return (
		<div className={styles.diceContainer}>
			<video
				height={357}
				muted
				className={`popout${props.showDice ? ' show' : ''}`}
				ref={diceVideo}>
				<source src='/dice_animation.webm' />
			</video>
			<Fade in={diceResult !== null}>
				<div className={styles.result}>{diceResult || lastDiceResult.current}</div>
			</Fade>
			<Fade in={diceDescription !== null}>
				<div className={styles.description}>
					{diceDescription || lastDiceDescription.current}
				</div>
			</Fade>
		</div>
	);
}
