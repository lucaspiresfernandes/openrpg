import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export default function BottomTextInput(
	props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) {
	return <input {...props} className={`theme-element bottom-text ${props.className}`} />;
}
