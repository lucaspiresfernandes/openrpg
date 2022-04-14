import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Fade from 'react-bootstrap/Fade';
import SheetModal from './SheetModal';
import { useContext, useEffect, useRef, useState } from 'react';
import { DiceResult, ResolvedDice, resolveDices } from '../../utils';
import api from '../../utils/api';
import { ErrorLogger } from '../../contexts';

type DiceRollResultModalProps = {
    onHide(): void;
    dices: ResolvedDice[];
    resolverKey?: string;
    onRollAgain(): void;
}

export default function DiceRollResultModal(props: DiceRollResultModalProps) {
    const [resultDices, setResultDices] = useState<DiceResult[]>([]);
    const [resultFade, setResultFade] = useState(false);
    const [descriptionFade, setDescriptionFade] = useState(false);
    const [loadingDice, setLoadingDice] = useState(false);
    const logError = useContext(ErrorLogger);
    const rollAgain = useRef(false);

    useEffect(() => {
        if (props.dices.length === 0) return;
        setLoadingDice(true);
        api.post('/dice', { dices: props.dices, resolverKey: props.resolverKey }, { timeout: 5000 }).then(res => {
            setResultDices(res.data.results);
            setResultFade(true);
            setTimeout(() => setDescriptionFade(true), 750);
        }).catch(logError).finally(() => setLoadingDice(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.dices]);

    function reset() {
        setResultDices([]);
        setResultFade(false);
        setDescriptionFade(false);
        if (rollAgain.current) props.onRollAgain();
        rollAgain.current = false;
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
            title='Resultado da Rolagem' onHide={props.onHide}
            closeButton={{ disabled: loadingDice }}
            backdrop={loadingDice ? 'static' : true}
            keyboard={loadingDice ? false : true} centered
            applyButton={{ name: 'Rolar Novamente', onApply: () => { rollAgain.current = true; }, disabled: loadingDice }}
            bodyStyle={{ minHeight: 120, display: 'flex', alignItems: 'center' }}>
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
                        <Col className={result?.roll ? 'h1 m-0' : ''}>
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