import { AttributeStatus } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

type PlayerAvatarContainerProps = {
    statusID?: number;
    onClick?(): void;
    playerStatus: {
        value: boolean;
        AttributeStatus: AttributeStatus;
    }[];
}

export default function PlayerAvatarContainer(props: PlayerAvatarContainerProps) {
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