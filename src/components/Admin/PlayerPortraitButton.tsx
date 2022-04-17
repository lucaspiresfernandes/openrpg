import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import GetPortraitModal from '../Modals/GetPortraitModal';

type PlayerPortraitButtonProps = {
	playerId: number;
};

export default function PlayerPortraitButton(props: PlayerPortraitButtonProps) {
	const [show, setShow] = useState(false);

	return (
		<>
			<Button size='sm' variant='secondary' onClick={() => setShow(true)}>
				Retrato
			</Button>
			<GetPortraitModal show={show} onHide={() => setShow(false)} playerId={props.playerId} />
		</>
	);
}
