import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import api from '../../utils/api';

type AvatarFieldProps = {
	status: { id: number; value: boolean }[];
	playerId: number;
};

export default function AvatarField({ status, playerId }: AvatarFieldProps) {
	const [src, setSrc] = useState('/avatar404.png');
	const previousStatusID = useRef(Number.MAX_SAFE_INTEGER);

	useEffect(() => {
		let statusID = 0;
		for (const stat of status) {
			if (stat.value) {
				statusID = stat.id;
				break;
			}
		}
		if (statusID === previousStatusID.current) return;
		previousStatusID.current = statusID;
		api
			.get(`/sheet/player/avatar/${statusID}?playerID=${playerId}`)
			.then((res) => setSrc(res.data.link))
			.catch((err) => {
				console.log(`Could not load avatar n°${statusID}.`);
				console.log(err);
				setSrc('/avatar404.png');
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	return (
		<Row>
			<Col>
				<Image
					src={src}
					alt='Avatar'
					width={210}
					height={300}
					onError={() => setSrc('/avatar404.png')}
				/>
			</Col>
		</Row>
	);
}
