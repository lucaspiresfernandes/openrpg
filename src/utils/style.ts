export function getAttributeStyle(color: string) {
	return {
		color: 'white',
		textShadow: `0 0 10px #${color}, 0 0 30px #${color}, 0 0 50px #${color}`,
	};
}