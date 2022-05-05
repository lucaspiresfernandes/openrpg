import type { CSSProperties } from 'react';

const style: CSSProperties = {
	width: '1.5rem',
	height: '1.5rem',
	verticalAlign: '-0.5rem',
};

export default function CustomSpinner() {
	return <div style={style} className='spinner-border spinner-border-sm'></div>;
}
