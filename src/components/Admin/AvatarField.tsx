import { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

type AvatarFieldProps = {
    status: { id: number; value: boolean; }[];
    playerId: number;
}

export default function AvatarField({ status, playerId }: AvatarFieldProps) {
    const [src, setSrc] = useState('/avatar404.png');
    const previousStatusID = useRef(0);

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
        setSrc(`/api/sheet/player/avatar/${statusID}?playerID=${playerId}&v=${Date.now()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <Row>
            <Col>
                <Image fluid src={src} alt='Avatar' style={{ maxHeight: 250 }}
                    onError={() => setSrc('/avatar404.png')} />
            </Col>
        </Row>
    );
}