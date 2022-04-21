export type DiceConfig = {
	//Legacy object
	base: DiceConfigCell;
	characteristic: DiceConfigCell;
	skill: DiceConfigCell;
	attribute: DiceConfigCell;
};

export type DiceConfigCell = {
	value: number;
	branched: boolean;
};

export type PortraitOrientation = 'center' | 'top' | 'bottom';

export type PortraitConfig = {
	attributes: number[];
	side_attribute: number;
	orientation: PortraitOrientation;
};

export type Environment = 'idle' | 'combat';

export type ContainerConfig = { originalName: string; name: string }[];
