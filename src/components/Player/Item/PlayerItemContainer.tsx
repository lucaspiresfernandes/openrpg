import { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import PlayerItemField from './PlayerItemField';

type PlayerItemContainerProps = {
    playerItems: {
        Item: {
            id: number;
            name: string;
            weight: number;
        };
        currentDescription: string;
        quantity: number;
    }[];
    playerMaxLoad: number;
    onDelete(id: number): void;
};

export default function PlayerItemContainer({ playerItems, playerMaxLoad, onDelete }: PlayerItemContainerProps) {
    const logError = useContext(ErrorLogger);
    const [lastMaxLoad, maxLoad, setMaxLoad] = useExtendedState(playerMaxLoad.toString());
    const [load, setLoad] = useState(playerItems.reduce((prev, cur) => prev + cur.Item.weight * cur.quantity, 0));

    function onMaxLoadBlur() {
        if (maxLoad === lastMaxLoad) return;
        let maxLoadFloat = parseFloat(maxLoad);
        if (isNaN(maxLoadFloat)) {
            maxLoadFloat = 0;
            setMaxLoad(maxLoadFloat.toString());
        }
        else setMaxLoad(maxLoad);
        api.post('/sheet/player', { maxLoad: maxLoadFloat }).catch(logError);
    }

    function onQuantityChange(id: number, value: number) {
        setLoad(playerItems.reduce((prev, cur) => {
            if (cur.Item.id === id) cur.quantity = value;
            return prev + cur.Item.weight * cur.quantity;
        }, 0));
    }

    const style = { color: load > parseFloat(maxLoad) ? 'red' : 'inherit' };

    return (
        <>
            <Row>
                <Col className='text-center h5'>
                    <span className='me-2'>Capacidade:</span>
                    <span style={style}> {load} /</span>
                    <BottomTextInput value={maxLoad} onChange={ev => setMaxLoad(ev.currentTarget.value)}
                        onBlur={onMaxLoadBlur} className='text-center' style={{ ...style, maxWidth: '3rem' }} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table responsive className='align-middle text-center'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Peso</th>
                                <th>Quant.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerItems.map(item =>
                                <PlayerItemField key={item.Item.id} description={item.currentDescription}
                                    item={item.Item} quantity={item.quantity} onDelete={onDelete}
                                    onQuantityChange={onQuantityChange} />
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}