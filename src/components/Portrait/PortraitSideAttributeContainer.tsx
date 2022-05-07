import { useEffect, useMemo, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import { clamp } from '../../utils';
import { getAttributeStyle } from '../../utils/style';

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
	sideAttribute: PortraitSideAttribute;
}) {
	const [sideAttribute, setSideAttribute] = useState(props.sideAttribute);
	const [y, setY] = useState(0);

	useEffect(() => {
		setY(Number(localStorage.getItem('side-attribute-pos-y')) || 420);
	}, []);

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

	const attributeStyle = useMemo(
		() => getAttributeStyle(sideAttribute?.Attribute.color || 'ffffff'),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	if (!sideAttribute) return null;

	function onDragStop(ev: DraggableEvent, data: DraggableData) {
		const pos = clamp(data.y, 0, 420);
		setY(pos);
		localStorage.setItem('side-attribute-pos-y', pos.toString());
	}

	return (
		<Draggable axis='y' onStop={onDragStop} position={{ x: 0, y }}>
			<div className={styles.sideContainer} style={{ ...attributeStyle }}>
				<label htmlFor='#' className={styles.side}>
					{sideAttribute.value}
				</label>
			</div>
		</Draggable>
	);
}
