import { useRef, useState } from 'react';
import type {
	DiceRoll,
	DiceRollResultModalProps,
} from '../components/Modals/DiceRollResultModal';

export type DiceRollEvent = (diceRoll: DiceRoll) => void;

export default function useDiceRoll(): [DiceRollResultModalProps, DiceRollEvent] {
	const [diceRoll, setDiceRoll] = useState<DiceRoll>({ dices: [] });

	const lastRoll = useRef<DiceRoll>({ dices: [] });

	const onDiceRoll: DiceRollEvent = ({ dices, resolverKey, onResult }) => {
		const roll = { dices, resolverKey, onResult };
		lastRoll.current = roll;
		setDiceRoll(roll);
	};

	const diceRollModalProps: DiceRollResultModalProps = {
		...diceRoll,
		onHide: () => setDiceRoll({ dices: [] }),
		onRollAgain: () => setDiceRoll(lastRoll.current),
	};

	return [diceRollModalProps, onDiceRoll];
}
