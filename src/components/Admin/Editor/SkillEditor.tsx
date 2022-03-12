import { Skill, Specialization } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import SkillEditorField from './SkillEditorField';

type SkillEditorProps = {
    skill: Skill[];
    specializations: Specialization[];
    onDelete(id: number): void;
}

export default function SkillEditor(props: SkillEditorProps) {
    return (
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
                        {props.skill.map(skill =>
                            <SkillEditorField key={skill.id} skill={skill}
                                onDelete={props.onDelete} specializations={props.specializations} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}