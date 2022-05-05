import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import GetPortraitModal from '../Modals/GetPortraitModal';

type PlayerPortraitButtonProps = {
	playerId: number;
};

export default function PlayerPortraitButton(props: PlayerPortraitButtonProps) {
	const [getPortraitModalShow, setGetPortraitModalShow] = useState(false);

	return (
		<>
			<Button size='sm' variant='secondary' onClick={() => setGetPortraitModalShow(true)}>
				Retrato
			</Button>
			<GetPortraitModal
				show={getPortraitModalShow}
				onHide={() => setGetPortraitModalShow(false)}
				playerId={props.playerId}
			/>
		</>
	);
}
