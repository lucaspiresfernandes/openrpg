import { useEffect, useMemo, useState } from 'react';
import type {
	ControlPosition,
	DraggableData,
	DraggableEvent,
	DraggableBounds,
} from 'react-draggable';
import Draggable from 'react-draggable';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import { getAttributeStyle } from '../../utils/style';

export type PortraitSideAttribute = {
	value: number;
	Attribute: {
		id: number;
		name: string;
		color: string;
	};
} | null;

const bounds: DraggableBounds = {
	bottom: 420,
	left: 0,
	top: 0,
	right: 200,
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
		props.socket.on('playerAttributeChange', (playerId, attributeId, value) => {
			if (value === null) return;

			setSideAttribute((attr) => {
				if (attr === null || attributeId !== attr.Attribute.id) return attr;
				return { value: value, Attribute: { ...attr.Attribute } };
			});
		});

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

	function onDragStop(ev: DraggableEvent, data: DraggableData) {
		const pos = {
			x: data.x,
			y: data.y,
		};
		setPosition(pos);
		localStorage.setItem('side-attribute-pos', JSON.stringify(pos));
	}

	return (
		<Draggable axis='both' onStop={onDragStop} position={position} bounds={bounds}>
			<div className={styles.sideContainer} style={{ ...attributeStyle }}>
				<label htmlFor='#' className={styles.side}>
					{sideAttribute.value}
				</label>
			</div>
		</Draggable>
	);
}
