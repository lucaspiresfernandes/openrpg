import { useEffect, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import styles from '../../../styles/PlayerAvatar.module.scss';

export default function PlayerAvatarContainer(props: { statusID?: number }) {
    const [src, setSrc] = useState('#');
    
    useEffect(() => {
        const newSrc = `/avatar/${props.statusID || 0}`;
        if (newSrc === src) return;
        setSrc(newSrc);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.statusID]);

    return (
        <Col xl={{ offset: 2 }} className='text-center'>
            <Image fluid src={src} alt='Avatar' className={`${styles.avatar} clickable`}
                onError={() => setSrc('/avatar404.png')} />
        </Col>
    );
}