import { AttributeStatus } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import styles from '../../../styles/PlayerContainer.module.scss';

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
                <Image fluid src={src} alt='Avatar' className={styles.avatar}
                    onError={() => setSrc('/avatar404.png')} />
            </Col>
        </Row>
    );
}