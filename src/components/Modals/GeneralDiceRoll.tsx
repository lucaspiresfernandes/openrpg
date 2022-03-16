import { useState } from 'react';
import { Button, Col, Container, Row, Image } from 'react-bootstrap';
import { clamp, ResolvedDice } from '../../utils';
import SheetModal from './SheetModal';

type Dice = {
    name: string,
    num: number,
    roll: number
}

type GeneralDiceRollProps = {
    show: boolean
    onHide(): void,
    showDiceResult(dices: string | ResolvedDice[], resolverKey?: string): void;
}

export default function GeneralDiceRoll(props: GeneralDiceRollProps) {
    const [dices, setDices] = useState<Dice[]>([{
        name: '1D4',
        num: 0,
        roll: 4
    },
    {
        name: '1D6',
        num: 0,
        roll: 6
    },
    {
        name: '1D8',
        num: 0,
        roll: 8
    },
    {
        name: '1D10',
        num: 0,
        roll: 10
    },
    {
        name: '1D12',
        num: 0,
        roll: 12
    },
    {
        name: '1D20',
        num: 0,
        roll: 20
    }
    ]);

    const showDiceRollResult = props.showDiceResult;

    function onRoll() {
        const rollDices: ResolvedDice[] = [];
        dices.map(dice => {
            if (dice.num > 0) rollDices.push({ num: dice.num, roll: dice.roll });
        });
        if (props.onHide) props.onHide();
        showDiceRollResult(rollDices);
    }

    function reset() {
        setDices(dices.map(dice => {
            dice.num = 0;
            return dice;
        }));
    }

    function setDice(index: number, coeff: number) {
        setDices(dices.map((dice, i) => {
            if (i === index) dice.num = clamp(dice.num + coeff, 0, 9);
            return dice;
        }));
    }

    return (
        <SheetModal {...props} onExited={reset} title='Rolagem Geral de Dados' applyButton={{ name: 'Rolar', onApply: onRoll }}
            centered>
            <Container fluid>
                <Row className='text-center'>
                    {dices.map((dice, index) =>
                        <Col xs={6} lg={4} key={index} className='my-2'>
                            <Row className='mb-1 justify-content-center'>
                                <Col>
                                    <Image src={`/dice${dice.roll}.png`} alt={dice.name}
                                        title={dice.name} style={{ maxHeight: 75 }} />
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col xs='auto'>
                                    <Button variant='dark' onClick={() => setDice(index, -1)}>
                                        -
                                    </Button>
                                </Col>
                                <Col xs='auto' className='align-self-center'>
                                    {dice.num}
                                </Col>
                                <Col xs='auto'>
                                    <Button variant='dark' onClick={() => setDice(index, 1)}>
                                        +
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
            </Container>
        </SheetModal>
    );
}