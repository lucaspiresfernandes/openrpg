import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import SkillEditorField from './SkillEditorField';
import { useContext, useState } from 'react';
import { Skill, Specialization } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateSkillModal from '../../../Modals/CreateSkillModal';
import SpecializationEditorField from './SpecializationEditorField';
import CreateSpecializationModal from '../../../Modals/CreateSpecializationModal';

type SkillEditorContainerProps = {
    skill: Skill[];
    specialization: Specialization[];
}

export default function SkillEditorContainer(props: SkillEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [skill, setSkill] = useState(props.skill);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [specialization, setSpec] = useState(props.specialization);

    function createSkill(name: string, mandatory: boolean, specializationID: number | null) {
        api.put('/sheet/skill', { name, specializationID, mandatory }).then(res => {
            const id = res.data.id;
            setSkill([...skill, { id, name, specialization_id: specializationID, mandatory }]);
        }).catch(logError);
    }

    function deleteSkill(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/skill', { data: { id } }).then(() => {
            const newSkill = [...skill];
            const index = newSkill.findIndex(skill => skill.id === id);
            if (index > -1) {
                newSkill.splice(index, 1);
                setSkill(newSkill);
            }
        }).catch(logError);
    }

    function createSpec(name: string) {
        api.put('/sheet/specialization', { name }).then(res => {
            const id = res.data.id;
            setSpec([...specialization, { id, name }]);
        }).catch(logError);
    }

    function deleteSpec(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/specialization', { data: { id } }).then(() => {
            const newSpec = [...specialization];
            const index = newSpec.findIndex(specialization => specialization.id === id);
            if (index > -1) {
                newSpec.splice(index, 1);
                setSpec(newSpec);
            }
        }).catch(logError);
    }

    return (
        <>
            <Row>
                <DataContainer outline title='Especializações'
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
                                    {specialization.map(specialization =>
                                        <SpecializationEditorField key={specialization.id}
                                            specialization={specialization} onDelete={deleteSpec} />
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </DataContainer>
            </Row>
            <Row>
                <DataContainer outline title='Perícias'
                    addButton={{ onAdd: () => setShowSkillModal(true) }}>
                    <Row>
                        <Col>
                            <Table responsive className='align-middle'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nome</th>
                                        <th>Especialização</th>
                                        <th>Obrigatório</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {skill.map(skill =>
                                        <SkillEditorField key={skill.id}
                                            skill={skill} onDelete={deleteSkill} specializations={specialization} />
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </DataContainer>
            </Row>
            <CreateSpecializationModal show={showSpecModal} onHide={() => setShowSpecModal(false)}
                onCreate={createSpec} />
            <CreateSkillModal show={showSkillModal} onHide={() => setShowSkillModal(false)}
                onCreate={createSkill} specialization={specialization} />
        </>
    );
}