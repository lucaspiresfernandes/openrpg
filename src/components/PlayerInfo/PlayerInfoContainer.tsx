import { Info } from '@prisma/client';
import { Col, Row } from 'react-bootstrap';
import DataContainer from '../DataContainer';
import PlayerInfoField from './PlayerInfoField';

type PlayerInfoContainerProps = {
    playerInfo: {
        info: Info,
        value: string
    }[]
}


export default function PlayerInfoContainer(props: PlayerInfoContainerProps) {
    return (
        <DataContainer title='Detalhes Pessoais'>
            {props.playerInfo.map(pinfo =>
                <PlayerInfoField key={pinfo.info.id} info={pinfo.info} value={pinfo.value} />
            )}
        </DataContainer>
    );
}