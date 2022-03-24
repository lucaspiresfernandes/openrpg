import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import CharacteristicEditorField from './CharacteristicEditorField';
import { useContext, useState } from 'react';
import { Characteristic } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateCharacteristicModal from '../../../Modals/CreateCharacteristicModal';

type CharacteristicEditorContainerProps = {
    characteristic: Characteristic[];
}

export default function CharacteristicEditorContainer(props: CharacteristicEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
    const [characteristic, setCharacteristic] = useState(props.characteristic);

    function createCharacteristic(name: string, rollable: boolean) {
        api.put('/sheet/characteristic', { name, rollable }).then(res => {
            const id = res.data.id;
            setCharacteristic([...characteristic, { id, name, rollable }]);
        }).catch(logError);
    }

    function deleteCharacteristic(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/characteristic', { data: { id } }).then(() => {
            const newCharacteristic = [...characteristic];
            const index = newCharacteristic.findIndex(char => char.id === id);
            if (index > -1) {
                newCharacteristic.splice(index, 1);
                setCharacteristic(newCharacteristic);
            }
        }).catch(logError);
    }

    return (
        <>
            <DataContainer outline title='Características'
                addButton={{ onAdd: () => setShowCharacteristicModal(true) }}>
                <Row>
                    <Col>
                        <Table responsive className='align-middle'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
                                    <th>Rolável</th>
                                </tr>
                            </thead>
                            <tbody>
                                {characteristic.map(characteristic =>
                                    <CharacteristicEditorField key={characteristic.id}
                                        characteristic={characteristic} onDelete={deleteCharacteristic} />
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </DataContainer>
            <CreateCharacteristicModal show={showCharacteristicModal} onHide={() => setShowCharacteristicModal(false)}
                onCreate={createCharacteristic} />
        </>
    );
}