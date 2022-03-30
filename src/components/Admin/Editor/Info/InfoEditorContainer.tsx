import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InfoEditorField from './InfoEditorField';
import { useContext, useState } from 'react';
import { Info } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateInfoModal from '../../../Modals/CreateInfoModal';
import AdminTable from '../../AdminTable';

type InfoEditorContainerProps = {
    info: Info[];
    disabled?: boolean;
}

export default function InfoEditorContainer(props: InfoEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [info, setInfo] = useState(props.info);

    function createInfo(name: string) {
        api.put('/sheet/info', { name }).then(res => {
            const id = res.data.id;
            setInfo([...info, { id, name, default: false }]);
        }).catch(logError);
    }

    function deleteInfo(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/info', { data: { id } }).then(() => {
            const newInfo = [...info];
            const index = newInfo.findIndex(info => info.id === id);
            if (index > -1) {
                newInfo.splice(index, 1);
                setInfo(newInfo);
            }
        }).catch(logError);
    }

    return (
        <>
            <DataContainer outline title='Informações Pessoais (Geral)'
                addButton={{ onAdd: () => setShowInfoModal(true), disabled: props.disabled }}>
                <Row>
                    <Col>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th title='Nome da Informação Pessoal.'>Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {info.map(info =>
                                    <InfoEditorField key={info.id} deleteDisabled={props.disabled}
                                        info={info} onDelete={deleteInfo} />
                                )}
                            </tbody>
                        </AdminTable>
                    </Col>
                </Row>
            </DataContainer>
            <CreateInfoModal show={showInfoModal} onHide={() => setShowInfoModal(false)}
                onCreate={createInfo} />
        </>
    );
}