import { useEffect, useState } from 'react';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import type { PortraitOrientation } from '../../utils/config';
import { getAttributeStyle, getOrientationStyle } from '../../utils/style';

export type PortraitSideAttribute = {
	value: number;
	Attribute: {
		id: number;
		name: string;
		color: string;
	};
} | null;

export default function PortraitSideAttributeContainer(props: {
	socket: SocketIO | null;
	orientation: PortraitOrientation;
	sideAttribute: PortraitSideAttribute;
}) {
	const [sideAttribute, setSideAttribute] = useState(props.sideAttribute);

	useEffect(() => {
		const socket = props.socket;
		if (!socket) return;

		socket.on('attributeChange', (playerId, attributeId, value) => {
			if (value === null) return;

			setSideAttribute((attr) => {
				if (attr === null || attributeId !== attr.Attribute.id) return attr;
				return { value: value, Attribute: { ...attr.Attribute } };
			});
		});

		return () => {
			socket.off('attributeChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	if (!sideAttribute) return null;

	return (
		<div className={`${styles.sideContainer} ${getOrientationStyle(props.orientation)}`}>
			<div
				className={styles.side}
				style={getAttributeStyle(sideAttribute.Attribute.color)}>
				{sideAttribute.value}
			</div>
		</div>
	);
}
