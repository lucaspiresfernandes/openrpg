import { useEffect, useMemo, useState } from 'react';
import type { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import { clamp } from '../../utils';
import { getAttributeStyle } from '../../utils/style';

type PortraitSideAttribute = {
	value: number;
	show: boolean;
	Attribute: {
		id: number;
		name: string;
		color: string;
	};
} | null;

const bounds = {
	bottom: 475,
	left: 5,
	top: 5,
	right: 215,
};

export default function PortraitSideAttributeContainer(props: {
	socket: SocketIO;
	sideAttribute: PortraitSideAttribute;
}) {
	const [sideAttribute, setSideAttribute] = useState(props.sideAttribute);
	const [position, setPosition] = useState<ControlPosition>({ x: 0, y: 0 });

	useEffect(() => {
		setPosition(
			(JSON.parse(
				localStorage.getItem('side-attribute-pos') || 'null'
			) as ControlPosition) || { x: 0, y: 420 }
		);
	}, []);

	useEffect(() => {
		props.socket.on(
			'playerAttributeChange',
			(playerId, attributeId, value, maxValue, show) => {
				setSideAttribute((attr) => {
					if (attr === null || attributeId !== attr.Attribute.id) return attr;
					return { value, show, Attribute: { ...attr.Attribute } };
				});
			}
		);

		return () => {
			props.socket.off('playerAttributeChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	const attributeStyle = useMemo(
		() => getAttributeStyle(sideAttribute?.Attribute.color || 'ffffff'),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	if (!sideAttribute) return null;

	function onDragStop(_ev: DraggableEvent, data: DraggableData) {
		const pos = {
			x: clamp(data.x, bounds.left, bounds.right),
			y: clamp(data.y, bounds.top, bounds.bottom),
		};
		setPosition(pos);
		localStorage.setItem('side-attribute-pos', JSON.stringify(pos));
	}

	return (
		<Draggable axis='both' onStop={onDragStop} position={position} bounds={bounds}>
			<div className={styles.sideContainer} style={{ ...attributeStyle }}>
				<div className={styles.sideBackground}></div>
				<label
					className={`${styles.sideContent} atributo-secundario ${sideAttribute.Attribute.name}`}>
					{sideAttribute.show ? sideAttribute.value : '?'}
				</label>
			</div>
		</Draggable>
	);
}
