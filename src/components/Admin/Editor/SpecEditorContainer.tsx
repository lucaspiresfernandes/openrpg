import DataContainer from '../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import SpecEditorField from './SpecEditorField';
import { useContext, useState } from 'react';
import { Spec } from '@prisma/client';
import api from '../../../utils/api';
import { ErrorLogger } from '../../../contexts';
import CreateSpecModal from '../../Modals/CreateSpecModal';

type SpecEditorContainerProps = {
    spec: Spec[];
}

export default function SpecEditorContainer(props: SpecEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [spec, setSpec] = useState(props.spec);

    function createSpec(name: string) {
        api.put('/sheet/spec', { name }).then(res => {
            const id = res.data.id;
            setSpec([...spec, { id, name }]);
        }).catch(logError);
    }

    function deleteSpec(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/spec', { data: { id } }).then(() => {
            const newSpec = [...spec];
            const index = newSpec.findIndex(spec => spec.id === id);
            if (index > -1) {
                newSpec.splice(index, 1);
                setSpec(newSpec);
            }
        }).catch(logError);
    }

    return (
        <>
            <DataContainer outline title='Especificações de Jogador'
                addButton={{ onAdd: () => setShowSpecModal(true) }}>
                <Row>
                    <Col>
                        <Table responsive className='align-middle'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spec.map(spec =>
                                    <SpecEditorField key={spec.id}
                                        spec={spec} onDelete={deleteSpec} />
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </DataContainer>
            <CreateSpecModal show={showSpecModal} onHide={() => setShowSpecModal(false)}
                onCreate={createSpec} />
        </>
    );
}