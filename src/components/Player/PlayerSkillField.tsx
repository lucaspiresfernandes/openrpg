import { FormEvent, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import styles from '../../styles/Skill.module.scss';
import config from '../../../openrpg.config.json';
import BottomTextInput from '../BottomTextInput';
import { ErrorLogger, ShowDiceResult } from '../../contexts';

type PlayerSkillFieldProps = {
    value: number;
    skill: {
        id: number;
        name: string;
        Specialization: {
            name: string;
        } | null;
    };
};

export default function PlayerSkillField(props: PlayerSkillFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(props.value);
    const logError = useContext(ErrorLogger);
    const showDiceRollResult = useContext(ShowDiceResult);

    function valueChange(ev: FormEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newValue = parseInt(aux);

        if (aux.length === 0) newValue = 0;
        else if (isNaN(newValue)) return;

        setValue(newValue);
    }

    function valueBlur() {
        if (value === lastValue) return;
        setValue(value);
        api.post('/sheet/player/skill', { id: props.skill.id, value }).catch(err => {
            logError(err);
            setValue(lastValue);
        });
    }

    function diceRoll() {
        const baseDice = config.player.base_dice;
        showDiceRollResult([{ num: 1, roll: baseDice, ref: value }], `${baseDice}b`);
    }

    let name = props.skill.name;
    if (props.skill.Specialization) name = `${props.skill.Specialization.name} (${name})`;

    return (
        <Col xs={6} md={3} xl={2} className={`${styles.container} my-3 clickable d-flex flex-column`}>
            <Row>
                <Col>
                    <BottomTextInput className={`${styles.text} text-center w-75`}
                        value={value} onChange={valueChange} onBlur={valueBlur} />
                </Col>
            </Row>
            <Row className={`${styles.label} h-100`} onClick={diceRoll}>
                <Col>{name}</Col>
            </Row>
        </Col>
    );
}