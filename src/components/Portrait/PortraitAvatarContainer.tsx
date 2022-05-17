import { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Image from 'react-bootstrap/Image';
import type { SocketIO } from '../../hooks/useSocket';
import styles from '../../styles/modules/Portrait.module.scss';
import api from '../../utils/api';
import type { PlayerAttributeStatusChangeEvent } from '../../utils/socket';

export type PortraitAttributeStatus = {
	value: boolean;
	attribute_status_id: number;
}[];

export default function PortraitAvatar(props: {
	attributeStatus: PortraitAttributeStatus;
	playerId: number;
	socket: SocketIO;
}) {
	const [src, setSrc] = useState('#');
	const [showAvatar, setShowAvatar] = useState(false);
	const [attributeStatus, setAttributeStatus] = useState(props.attributeStatus);
	const previousStatusID = useRef(Number.MAX_SAFE_INTEGER);

	useEffect(() => {
		const id = attributeStatus.find((stat) => stat.value)?.attribute_status_id || 0;
		previousStatusID.current = id;
		api
			.get(`/sheet/player/avatar/${id}`, { params: { playerID: props.playerId } })
			.then((res) => setSrc(`${res.data.link}?v=${Date.now()}`))
			.catch(() => setSrc('/avatar404.png'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const socket_playerAttributeStatusChange = useRef<PlayerAttributeStatusChangeEvent>(
		() => {}
	);

	useEffect(() => {
		socket_playerAttributeStatusChange.current = (playerId, id, value) => {
			if (playerId !== props.playerId) return;
			const newStatus = [...attributeStatus];

			const index = newStatus.findIndex((stat) => stat.attribute_status_id === id);
			if (index === -1) return;

			newStatus[index].value = value;

			const newStatusID = newStatus.find((stat) => stat.value)?.attribute_status_id || 0;
			setAttributeStatus(newStatus);

			if (newStatusID !== previousStatusID.current) {
				previousStatusID.current = newStatusID;
				api
					.get(`/sheet/player/avatar/${newStatusID}`, {
						params: { playerID: props.playerId },
					})
					.then((res) => {
						if (res.data.link === src.split('?')[0]) return;
						setShowAvatar(false);
						setSrc(`${res.data.link}?v=${Date.now()}`);
					})
					.catch(() => setSrc('/avatar404.png'));
			}
		};
	});

	useEffect(() => {
		props.socket.on('playerAttributeStatusChange', (playerId, id, value) =>
			socket_playerAttributeStatusChange.current(playerId, id, value)
		);

		return () => {
			props.socket.off('playerAttributeStatusChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.socket]);

	return (
		<Fade in={showAvatar}>
			<div>
				<Image
					src={src}
					alt='Avatar'
					onError={() => setSrc('/avatar404.png')}
					onLoad={() => setShowAvatar(true)}
					className={styles.avatar}
				/>
			</div>
		</Fade>
	);
}
