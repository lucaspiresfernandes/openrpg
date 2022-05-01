import { useEffect, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import type { Environment, PortraitOrientation } from '../../utils/config';
import { getAttributeStyle, getOrientationStyle } from '../../utils/style';

type PortraitPlayerName = {
	value: string;
	info_id: number;
};

type PortraitAttributes = {
	value: number;
	Attribute: {
		id: number;
		name: string;
		color: string;
	};
	maxValue: number;
}[];

export default function PortraitEnvironmentalContainer(props: {
	socket: SocketIO | null;
	environment: Environment;
	orientation: PortraitOrientation;
	attributes: PortraitAttributes;
	playerName: PortraitPlayerName;
	playerId: number;
}) {
	const [environment, setEnvironment] = useState(props.environment);

	useEffect(() => {
		const socket = props.socket;
		if (!socket) return;

		socket.on('configChange', (name, newValue) => {
			if (name === 'environment') {
				setEnvironment(newValue as Environment);
			}
		});

		return () => {
			socket.off('configChange');
		};
	}, [props.socket]);

	return (
		<>
			<PortraitAttributesContainer
				environment={environment}
				orientation={props.orientation}
				attributes={props.attributes}
				playerId={props.playerId}
				socket={props.socket}
			/>
			<PortraitNameContainer
				environment={environment}
				orientation={props.orientation}
				playerName={props.playerName}
				playerId={props.playerId}
				socket={props.socket}
			/>
		</>
	);
}

function PortraitAttributesContainer(props: {
	socket: SocketIO | null;
	environment: Environment;
	orientation: PortraitOrientation;
	attributes: PortraitAttributes;
	playerId: number;
}) {
	const [attributes, setAttributes] = useState(props.attributes);

	useEffect(() => {
		const socket = props.socket;
		if (!socket) return;

		socket.on('attributeChange', (playerId, attributeId, value, maxValue) => {
			if (playerId !== props.playerId) return;

			setAttributes((attributes) => {
				const index = attributes.findIndex((attr) => attr.Attribute.id === attributeId);
				if (index === -1) return attributes;

				const newAttributes = [...attributes];

				if (value !== null) newAttributes[index].value = value;
				if (maxValue !== null) newAttributes[index].maxValue = maxValue;

				return newAttributes;
			});
		});

		return () => {
			socket.off('attributeChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	return (
		<Fade in={props.environment === 'combat'}>
			<div className={`${styles.combat} ${getOrientationStyle(props.orientation)}`}>
				{attributes.map((attr) => (
					<div
						className={styles.attribute}
						style={getAttributeStyle(attr.Attribute.color)}
						key={attr.Attribute.id}>
						{attr.value}/{attr.maxValue}
					</div>
				))}
			</div>
		</Fade>
	);
}

function PortraitNameContainer(props: {
	socket: SocketIO | null;
	environment: Environment;
	orientation: PortraitOrientation;
	playerName: PortraitPlayerName;
	playerId: number;
}) {
	const [playerName, setPlayerName] = useState(props.playerName.value);

	useEffect(() => {
		const socket = props.socket;
		if (!socket) return;

		socket.on('infoChange', (playerId, infoId, value) => {
			if (playerId !== props.playerId || infoId !== props.playerName.info_id) return;
			setPlayerName(value);
		});

		return () => {
			socket.off('infoChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	return (
		<Fade in={props.environment === 'idle'}>
			<div
				className={`${styles.nameContainer} ${getOrientationStyle(props.orientation)}`}>
				{playerName || 'Desconhecido'}
			</div>
		</Fade>
	);
}
