import { Row, Col, Container, Image, Fade } from 'react-bootstrap';
import SheetModal from './SheetModal';
import { useContext, useEffect, useState } from 'react';
import { DiceResult, ResolvedDice, resolveDices } from '../../utils';
import api from '../../utils/api';
import { ErrorLogger } from '../../contexts';

type DiceRollResultModalProps = {
    onHide(): void;
    dices: string | ResolvedDice[];
    resolverKey?: string;
    bonusDamage?: string;
}

export default function DiceRollResultModal(props: DiceRollResultModalProps) {
    const [resultDices, setResultDices] = useState<DiceResult[]>([]);
    const [resultFade, setResultFade] = useState(false);
    const [descriptionFade, setDescriptionFade] = useState(false);
    const logError = useContext(ErrorLogger);

    useEffect(() => {
        if (props.dices.length === 0) return;
        let resolved = props.dices;
        if (typeof props.dices === 'string') {
            const aux = resolveDices(props.dices as string, { bonusDamage: props.bonusDamage });
            if (!aux) return;
            resolved = aux;
        }

        api.post('/dice', { dices: resolved, resolverKey: props.resolverKey }).then(res => {
            setResultDices(res.data.results);
            setResultFade(true);
            setTimeout(() => setDescriptionFade(true), 750);
        }).catch(logError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.dices]);

    function reset() {
        setResultDices([]);
        setResultFade(false);
        setDescriptionFade(false);
    }

    let result: DiceResult | undefined = undefined;

    if (resultDices.length === 1) {
        result = resultDices[0];
    }
    else if (resultDices.length > 1) {
        const dices = resultDices.map(d => d.roll);
        const sum = dices.reduce((a, b) => a + b, 0);
        result = { roll: sum, description: dices.join(' + ') };
    }

    return (
        <SheetModal show={props.dices.length != 0} onExited={reset}
            title='Resultado da Rolagem' onHide={props.onHide} centered>
            <Container fluid className='text-center'>
                {resultDices.length === 0 &&
                    <Row>
                        <Col>
                            <Image src='/loading.svg' alt='Loading...' fluid />
                        </Col>
                    </Row>
                }
                <Row>
                    <Fade in={resultFade}>
                        <Col className='h1'>
                            {result?.roll}
                        </Col>
                    </Fade>
                </Row>
                <Row>
                    <Fade in={descriptionFade}>
                        <Col>
                            {result?.description}
                        </Col>
                    </Fade>
                </Row>
            </Container>
        </SheetModal>
    );
}