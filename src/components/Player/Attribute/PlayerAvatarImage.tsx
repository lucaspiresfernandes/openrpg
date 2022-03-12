import { useEffect, useRef, useState } from 'react';
import { Col, Image } from 'react-bootstrap';
import { PlayerStatus } from './PlayerAttributeContainer';

export default function PlayerAvatarContainer(props: { statusID?: number, onClick?(): void, playerStatus: PlayerStatus[] }) {
    const statusID = props.statusID || 0;

    const [src, setSrc] = useState(`/api/sheet/player/avatar/${statusID}`);
    const previousStatusID = useRef(statusID);

    useEffect(() => {
        if (statusID === previousStatusID.current) return;
        previousStatusID.current = statusID;
        setSrc(`/api/sheet/player/avatar/${statusID}?v=${Date.now()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.statusID, props.playerStatus]);

    return (
        <Col xl={{ offset: 2 }} className='text-center'>
            <Image fluid src={src} alt='Avatar' className='clickable'
                style={{ minWidth: 100, minHeight: 100, maxHeight: 400 }}
                onError={() => setSrc('/avatar404.png')} onClick={props.onClick} />
        </Col>
    );
}