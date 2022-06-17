import type { DiceResolverKeyNum } from './dice';

export type DiceConfig = {
	//Legacy object
	base: DiceConfigCell;

	characteristic: DiceConfigCell & {
		enable_modifiers: boolean;
	};
	skill: DiceConfigCell & {
		enable_modifiers: boolean;
	};
	attribute: DiceConfigCell;
};

export type DiceConfigCell = {
	value: DiceResolverKeyNum;
	branched: boolean;
};

export type PortraitFontConfig = {
	name: string;
	data: string;
};

export type Environment = 'idle' | 'combat';