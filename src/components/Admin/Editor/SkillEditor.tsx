import { Skill } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type SkillEditorProps = {
    skill: Skill[];
}

export default function SkillEditor(props: SkillEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}