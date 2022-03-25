import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminTable from '../../AdminTable';
import SkillEditorField from './SkillEditorField';
import { useContext, useState } from 'react';
import { Skill, Specialization } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateSkillModal from '../../../Modals/CreateSkillModal';
import SpecializationEditorField from './SpecializationEditorField';
import CreateSpecializationModal from '../../../Modals/CreateSpecializationModal';

type SkillEditorContainerProps = {
    skills: Skill[];
    specializations: Specialization[];
}

export default function SkillEditorContainer(props: SkillEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [skills, setSkills] = useState(props.skills);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [specializations, setSpecializations] = useState(props.specializations);

    function createSkill(name: string, mandatory: boolean, specializationID: number | null) {
        api.put('/sheet/skill', { name, specializationID, mandatory }).then(res => {
            const id = res.data.id;
            setSkills([...skills, { id, name, specialization_id: specializationID, mandatory }]);
        }).catch(logError);
    }

    function deleteSkill(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/skill', { data: { id } }).then(() => {
            const newSkill = [...skills];
            const index = newSkill.findIndex(skill => skill.id === id);
            if (index > -1) {
                newSkill.splice(index, 1);
                setSkills(newSkill);
            }
        }).catch(logError);
    }

    function onSpecializationNameChange(id: number, name: string) {
        const newSpecializations = [...specializations];
        const sp = newSpecializations.find(sp => sp.id === id);
        if (sp) {
            sp.name = name;
            setSpecializations(newSpecializations);
        }
    }

    function createSpecialization(name: string) {
        api.put('/sheet/specialization', { name }).then(res => {
            const id = res.data.id;
            setSpecializations([...specializations, { id, name }]);
        }).catch(logError);
    }

    function deleteSpecialization(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/specialization', { data: { id } }).then(() => {
            const newSpec = [...specializations];
            const index = newSpec.findIndex(specialization => specialization.id === id);
            if (index > -1) {
                newSpec.splice(index, 1);
                setSpecializations(newSpec);
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
                            <AdminTable>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specializations.map(specialization =>
                                        <SpecializationEditorField key={specialization.id}
                                            specialization={specialization} onDelete={deleteSpecialization}
                                            onNameChange={onSpecializationNameChange} />
                                    )}
                                </tbody>
                            </AdminTable>
                        </Col>
                    </Row>
                </DataContainer>
            </Row>
            <Row>
                <DataContainer outline title='Perícias'
                    addButton={{ onAdd: () => setShowSkillModal(true) }}>
                    <Row>
                        <Col>
                            <AdminTable>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nome</th>
                                        <th>Especialização</th>
                                        <th>Obrigatório</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {skills.map(skill =>
                                        <SkillEditorField key={skill.id}
                                            skill={skill} onDelete={deleteSkill} specializations={specializations} />
                                    )}
                                </tbody>
                            </AdminTable>
                        </Col>
                    </Row>
                </DataContainer>
            </Row>
            <CreateSpecializationModal show={showSpecModal} onHide={() => setShowSpecModal(false)}
                onCreate={createSpecialization} />
            <CreateSkillModal show={showSkillModal} onHide={() => setShowSkillModal(false)}
                onCreate={createSkill} specialization={specializations} />
        </>
    );
}