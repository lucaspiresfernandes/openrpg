export type ResolvedDice = {
	num: number;
	roll: number;
	ref?: number;
};

export type DiceResult = {
	roll: number;
	resultType?: {
		description: string;
		isSuccess: boolean;
	}
};

type ResolveDiceOptions = {
	bonusDamage?: string;
};

export function resolveDices(
	dices: string,
	diceOptions?: ResolveDiceOptions
): ResolvedDice[] | undefined {
	let formattedDiceString = dices.replace(/\s/g, '').toLowerCase();

	const options = formattedDiceString.split('/');
	if (options.length > 1) {
		const auxOptions = Array.from(
			formattedDiceString.matchAll(/(?:\/|^)(.*?\d)(?=\/\d|$)/g),
			(x) => x[1]
		);
		if (auxOptions.length > 1) {
			const selected = prompt(
				'Escolha dentre as seguintes opções de rolagem:\n' +
					auxOptions.map((opt, i) => `${i + 1}: ${opt}`).join('\n')
			);

			if (!selected) return;

			const code = parseInt(selected);

			if (!code || code > auxOptions.length) return;

			formattedDiceString = auxOptions[code - 1];
		}
	}

	const diceArray = formattedDiceString.split('+');
	const resolvedDices: ResolvedDice[] = [];

	for (let i = 0; i < diceArray.length; i++)
		resolvedDices.push(resolveDice(diceArray[i], diceOptions?.bonusDamage));

	return resolvedDices;
}

function resolveDice(dice: string, bonusDamage: string = '0'): ResolvedDice {
	if (dice.includes('db/')) {
		const divider = parseInt(dice.split('/')[1]) || 1;

		const split = bonusDamage.split('d');

		let _dice = `${split[0]}d${Math.round(parseInt(split[1]) / divider)}`;

		if (split.length === 1) _dice = Math.round(parseInt(split[0]) / divider).toString();

		return resolveDice(_dice);
	}
	if (dice.includes('db')) return resolveDice(bonusDamage);

	const split = dice.split('d');
	if (split.length === 1) return { num: 0, roll: parseInt(dice) };
	return { num: parseInt(split[0]), roll: parseInt(split[1]) };
}