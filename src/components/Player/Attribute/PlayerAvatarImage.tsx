import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

type PlayerAvatarContainerProps = {
    statusID?: number;
    rerender: boolean;
    onClick?(): void;
}

export default function PlayerAvatarContainer(props: PlayerAvatarContainerProps) {
    const statusID = props.statusID || 0;

    const [src, setSrc] = useState('#');
    const previousStatusID = useRef(statusID);

    useEffect(() => {
        setSrc(`/api/sheet/player/avatar/${statusID}?v=${Date.now()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.rerender]);

    useEffect(() => {
        if (statusID === previousStatusID.current) return;
        previousStatusID.current = statusID;
        setSrc(`/api/sheet/player/avatar/${statusID}?v=${Date.now()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.statusID]);

    return (
        <Col xl={{ offset: 2 }} className='text-center'>
            <Image fluid src={src} alt='Avatar' className='clickable'
                style={{ minWidth: 100, minHeight: 100, maxHeight: 550 }}
                onError={() => setSrc('/avatar404.png')} onClick={props.onClick} />
        </Col>
    );
}