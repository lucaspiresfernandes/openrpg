export type DiceRequest = {
	num: number;
	roll: number;
	ref?: number;
};

export type DiceResponse = {
	roll: number;
	resultType?: {
		description: string;
		isSuccess: boolean;
	};
};

export function resolveDices(dices: string) {
	let formattedDiceString = dices.replace(/\s/g, '').toUpperCase();

	const options = formattedDiceString.split('|');

	if (options.length > 1) {
		const selected = prompt(
			'Escolha dentre as seguintes opções de rolagem:\n' +
				options.map((opt, i) => `${i + 1}: ${opt}`).join('\n')
		);

		if (!selected) return;

		const code = parseInt(selected);

		if (!code || code > options.length) return;

		formattedDiceString = options[code - 1];
	}

	const diceArray = formattedDiceString.split('+');
	const resolvedDices: DiceRequest[] = [];

	for (let i = 0; i < diceArray.length; i++) {
		const dice = resolveDice(diceArray[i]);
		if (dice.roll > 0) resolvedDices.push(dice);
	}

	return resolvedDices;
}

function resolveDice(dice: string): DiceRequest {
	if (dice.includes('DB')) {
		const bonusDamageArray = document.getElementsByName(
			'specDano Bônus'
		) as NodeListOf<HTMLInputElement>;

		if (bonusDamageArray.length > 0) {
			const bonusDamage = bonusDamageArray[0].value.replace(/\s/g, '').toUpperCase();

			const divider = parseInt(dice.split('/')[1]) || 1;
			const split = bonusDamage.split('D');

			if (split.length === 1) dice = Math.floor(parseInt(split[0]) / divider).toString();
			else dice = `${split[0]}D${Math.floor(parseInt(split[1]) / divider)}`;
		}
	} else {
		const regexResult = dice.match(/[A-Z][A-Z][A-Z]/g);
		if (regexResult) {
			const charName = regexResult[0];
			const charElementArray = document.getElementsByName(`char${charName}`);

			if (charElementArray.length > 0) {
				const charElement = charElementArray[0] as HTMLInputElement;
				const divider = parseInt(dice.split('/')[1]) || 1;

				dice = Math.floor(parseInt(charElement.value) / divider).toString();
			}
		}
	}

	const split = dice.split('D');
	if (split.length === 1) return { num: 0, roll: parseInt(dice) || 0 };
	return { num: parseInt(split[0]), roll: parseInt(split[1]) || 0 };
}
