import { useEffect, useRef, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';

type AvatarFieldProps = {
    status: { id: number; value: boolean; }[];
}

export default function AvatarField(props: AvatarFieldProps) {
    const [src, setSrc] = useState('/avatar404.png');
    const previousStatusID = useRef(0);

    useEffect(() => {
        let statusID = 0;
        for (const stat of props.status) {
            if (stat.value) {
                statusID = stat.id;
                break;
            }
        }
        if (statusID === previousStatusID.current) return;
        previousStatusID.current = statusID;
        setSrc(`/api/sheet/player/avatar/${statusID}?v=${Date.now()}`);
    }, [props.status]);

    return (
        <Row>
            <Col>
                <Image fluid src={src} alt='Avatar' style={{ maxHeight: 250 }}
                    onError={() => setSrc('/avatar404.png')} />
            </Col>
        </Row>
    );
}