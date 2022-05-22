import { useEffect, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import type {
	DraggableBounds,
	DraggableData,
	DraggableEvent,
	DraggableEventHandler,
} from 'react-draggable';
import Draggable from 'react-draggable';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import type { Environment } from '../../utils/config';
import { getAttributeStyle } from '../../utils/style';

type PortraitPlayerName = { name: string; show: boolean };

type PortraitAttributes = {
	value: number;
	Attribute: {
		id: number;
		name: string;
		color: string;
	};
	maxValue: number;
	show: boolean;
}[];

const bounds: DraggableBounds = {
	top: 0,
	bottom: 450,
	left: 0,
	right: 0,
};

export default function PortraitEnvironmentalContainer(props: {
	socket: SocketIO;
	environment: Environment;
	attributes: PortraitAttributes;
	playerName: PortraitPlayerName;
	playerId: number;
}) {
	const [environment, setEnvironment] = useState(props.environment);
	const [positionY, setPositionY] = useState(0);

	useEffect(() => {
		setPositionY(Number(localStorage.getItem('environmental-pos-y') || 300));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		props.socket.on('configChange', (name, newValue) => {
			if (name === 'environment') setEnvironment(newValue as Environment);
		});

		return () => {
			props.socket.off('configChange');
		};
	}, [props.socket]);

	function onDragStop(ev: DraggableEvent, data: DraggableData) {
		const posY = data.y;
		setPositionY(posY);
		localStorage.setItem('environmental-pos-y', posY.toString());
	}

	return (
		<>
			<PortraitAttributesContainer
				positionY={positionY}
				onDragStop={onDragStop}
				environment={environment}
				attributes={props.attributes}
				playerId={props.playerId}
				socket={props.socket}
			/>
			<PortraitNameContainer
				positionY={positionY}
				onDragStop={onDragStop}
				environment={environment}
				playerName={props.playerName}
				playerId={props.playerId}
				socket={props.socket}
			/>
		</>
	);
}

function PortraitAttributesContainer(props: {
	positionY: number;
	onDragStop: DraggableEventHandler;
	socket: SocketIO;
	environment: Environment;
	attributes: PortraitAttributes;
	playerId: number;
}) {
	const [attributes, setAttributes] = useState(props.attributes);

	useEffect(() => {
		props.socket.on(
			'playerAttributeChange',
			(playerId, attributeId, value, maxValue, show) => {
				if (playerId !== props.playerId) return;

				setAttributes((attributes) => {
					const index = attributes.findIndex((attr) => attr.Attribute.id === attributeId);
					if (index === -1) return attributes;

					const newAttributes = [...attributes];

					if (value !== null) newAttributes[index].value = value;
					if (maxValue !== null) newAttributes[index].maxValue = maxValue;
					if (show != null) newAttributes[index].show = show;

					return newAttributes;
				});
			}
		);

		return () => {
			props.socket.off('playerAttributeChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	return (
		<Draggable
			axis='y'
			onStop={props.onDragStop}
			position={{ x: 0, y: props.positionY }}
			bounds={bounds}>
			<Fade in={props.environment === 'combat'}>
				<div className={styles.combat}>
					{attributes.map((attr) => (
						<div
							className={styles.attribute}
							style={getAttributeStyle(attr.Attribute.color)}
							key={attr.Attribute.id}>
							<label>{attr.show ? `${attr.value}/${attr.maxValue}` : '?/?'}</label>
						</div>
					))}
				</div>
			</Fade>
		</Draggable>
	);
}

function PortraitNameContainer(props: {
	positionY: number;
	onDragStop: DraggableEventHandler;
	socket: SocketIO;
	environment: Environment;
	playerName: PortraitPlayerName;
	playerId: number;
}) {
	const [playerName, setPlayerName] = useState(props.playerName);

	useEffect(() => {
		props.socket.on('playerNameChange', (playerId, name) => {
			if (playerId !== props.playerId) return;
			setPlayerName((pn) => ({ ...pn, name }));
		});

		props.socket.on('playerNameShowChange', (playerId, show) => {
			if (playerId !== props.playerId) return;
			setPlayerName((pn) => ({ ...pn, show }));
		});

		return () => {
			props.socket.off('playerNameChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	return (
		<Draggable
			axis='y'
			onStop={props.onDragStop}
			position={{ x: 0, y: props.positionY }}
			bounds={bounds}>
			<Fade in={props.environment === 'idle'}>
				<label className={styles.nameContainer}>
					{playerName.show ? playerName.name || 'Desconhecido' : '???'}
				</label>
			</Fade>
		</Draggable>
	);
}
