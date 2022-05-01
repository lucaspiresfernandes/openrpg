import type { PortraitOrientation } from './config';
import PortraitStyles from '../styles/modules/Portrait.module.scss';

export function getAttributeStyle(color: string) {
	return {
		color: 'white',
		textShadow: `0 0 10px #${color}, 0 0 30px #${color}, 0 0 50px #${color}`,
	};
}

export function getOrientationStyle(orientation: PortraitOrientation) {
	switch (orientation) {
		case 'center':
			return PortraitStyles.center;
		case 'top':
			return PortraitStyles.top;
		case 'bottom':
			return PortraitStyles.bottom;
		default:
			return PortraitStyles.center;
	}
}
