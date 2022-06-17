import { useRef, useState } from 'react';
import type { DiceRoll, DiceRollModalProps } from '../components/Modals/DiceRollModal';

export type DiceRollEvent = (diceRoll: DiceRoll) => void;

export default function useDiceRoll(npcId?: number): [DiceRollModalProps, DiceRollEvent] {
	const [diceRoll, setDiceRoll] = useState<DiceRoll>({ dices: null });

	const lastRoll = useRef<DiceRoll>({ dices: null });

	const onDiceRoll: DiceRollEvent = ({ dices, resolverKey, onResult }) => {
		const roll = { dices, resolverKey, onResult };
		lastRoll.current = roll;
		setDiceRoll(roll);
	};

	const diceRollModalProps: DiceRollModalProps = {
		...diceRoll,
		onHide: () => setDiceRoll({ dices: null }),
		onRollAgain: () => setDiceRoll(lastRoll.current),
		npcId,
	};

	return [diceRollModalProps, onDiceRoll];
}
