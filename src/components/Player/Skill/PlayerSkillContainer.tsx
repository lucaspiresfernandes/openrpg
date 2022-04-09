import { Skill } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, Socket } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import AddDataModal from '../../Modals/AddDataModal';
import PlayerSkillField from './PlayerSkillField';

type PlayerSkill = {
    value: number;
    Skill: {
        id: number;
        name: string;
        Specialization: {
            name: string;
        } | null;
    };
};

type PlayerSkillContainerProps = {
    playerSkills: PlayerSkill[];
    availableSkills: Skill[];
    skillDiceConfig: {
        value: number;
        branched: boolean;
    };
    title: string;
}

export default function PlayerSkillContainer(props: PlayerSkillContainerProps) {
    const [addSkillShow, setAddSkillShow] = useState(false);
    const [skills, setSkills] = useState<{ id: number, name: string }[]>(props.availableSkills);
    const [playerSkills, setPlayerSkills] = useState(props.playerSkills);
    const [search, setSearch] = useState('');

    const socket = useContext(Socket);
    const logError = useContext(ErrorLogger);

    function onAddSkill(id: number) {
        api.put('/sheet/player/skill', { id }).then(res => {
            const skill = res.data.skill;
            setPlayerSkills([...playerSkills, skill]);

            const newSkills = [...skills];
            newSkills.splice(newSkills.findIndex(eq => eq.id === id), 1);
            setSkills(newSkills);
        }).catch(logError);
    }

    useEffect(() => {
        if (!socket) return;

        socket.on('playerSkillChange', (id, name, Specialization) => {
            setPlayerSkills(skills => {
                const index = skills.findIndex(skill => skill.Skill.id === id);
                if (index === -1) return skills;

                const newSkills = [...skills];
                newSkills[index].Skill = { id, name, Specialization };
                return newSkills;
            });

            setSkills(skills => {
                const index = skills.findIndex(skill => skill.id === id);
                if (index === -1) return skills;

                const newSkills = [...skills];
                newSkills[index].name = name;
                return newSkills;
            });
        });

        return () => {
            socket.off('playerSkillChange');
        };
    }, [socket]);

    return (
        <>
            <DataContainer outline title={props.title} addButton={{ onAdd: () => setAddSkillShow(true) }}>
                <Row className='mb-3'>
                    <Col>
                        <Form.Control className='theme-element' placeholder='Procurar'
                            value={search} onChange={ev => setSearch(ev.currentTarget.value)} />
                    </Col>
                </Row>
                <Row className='mb-3 mx-1 text-center justify-content-center'>
                    {playerSkills.map(skill => {
                        if (skill.Skill.name.toLowerCase().includes(search.toLowerCase())) return (
                            <PlayerSkillField key={skill.Skill.id} value={skill.value}
                                skill={skill.Skill} baseDice={props.skillDiceConfig} />
                        );
                        return null;
                    })}
                </Row>
            </DataContainer>
            <AddDataModal title='Adicionar' show={addSkillShow} onHide={() => setAddSkillShow(false)}
                data={skills} onAddData={onAddSkill} />
        </>
    );
}