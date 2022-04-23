import { useMemo } from 'react';
import { useRef, useState } from 'react';
import { DiceRoll, DiceRollResultModalProps } from '../components/Modals/DiceRollResultModal';
import { DiceResult, ResolvedDice } from '../utils/dice';

export type DiceRollEvent = (
	dices: ResolvedDice[],
	resolverKey?: string,
	onResult?: (result: DiceResult[]) => void
) => void;

export default function useDiceRoll(): [DiceRollResultModalProps, DiceRollEvent] {
	const [diceRoll, setDiceRoll] = useState<DiceRoll>({ dices: [] });

	const lastRoll = useRef<DiceRoll>({ dices: [] });

	const onDiceRoll: DiceRollEvent = (dices, resolverKey, onResult) => {
		const roll = { dices, resolverKey, onResult };
		lastRoll.current = roll;
		setDiceRoll(roll);
	};

	const DiceRollModalProps: DiceRollResultModalProps = useMemo(
		() => ({
			...diceRoll,
			onHide: () => setDiceRoll({ dices: [] }),
			onRollAgain: () => setDiceRoll(lastRoll.current),
		}),
		[diceRoll]
	);

	return [DiceRollModalProps, onDiceRoll];
}
