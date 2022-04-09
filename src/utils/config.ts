export type DiceConfig = {
    base: {
        value: number;
        branched: boolean;
    };
    attribute: {
        value: number;
        branched: boolean;
    };
};

export type PortraitOrientation = 'center' | 'top' | 'bottom';

export type PortraitConfig = {
    attributes: number[];
    side_attribute: number;
    orientation: PortraitOrientation;
}

export type Environment = 'idle' | 'combat';

export type ContainerConfig = { originalName: string, name: string }[];