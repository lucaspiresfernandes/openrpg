import { Currency, Item } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { ErrorLogger, Socket } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';
import DataContainer from '../../DataContainer';
import AddDataModal from '../../Modals/AddDataModal';
import PlayerCurrencyField from '../PlayerCurrencyField';
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
    availableItems: Item[];
    playerMaxLoad: number;
    playerCurrency: {
        value: string;
        Currency: Currency;
    }[];
    title: string;
};

export default function PlayerItemContainer(props: PlayerItemContainerProps) {
    const [addItemShow, setAddItemShow] = useState(false);
    const [items, setItems] = useState<{ id: number, name: string }[]>(props.availableItems);
    const [playerItems, setPlayerItems] = useState(props.playerItems);
    const playerItemsRef = useRef(playerItems);
    playerItemsRef.current = playerItems;
    const logError = useContext(ErrorLogger);
    const socket = useContext(Socket);
    const [lastMaxLoad, maxLoad, setMaxLoad] = useExtendedState(props.playerMaxLoad.toString());
    const [load, setLoad] = useState(playerItems.reduce((prev, cur) => prev + cur.Item.weight * cur.quantity, 0));

    useEffect(() => {
        if (!socket) return;

        socket.on('playerItemAdd', (id, name) => {
            setItems(items => {
                if (items.findIndex(item => item.id === id) > -1 ||
                    playerItemsRef.current.findIndex(eq => eq.Item.id === id) > -1)
                    return items;
                return [...items, { id, name }];
            });
        });

        socket.on('playerItemRemove', (id) => {
            setItems(items => {
                const index = items.findIndex(item => item.id === id);
                if (index === -1) return items;

                const newItems = [...items];
                newItems.splice(index, 1);
                return newItems;
            });
        });

        socket.on('playerItemChange', (id, name) => {
            setPlayerItems(items => {
                const index = items.findIndex(eq => eq.Item.id === id);
                if (index === -1) return items;

                const newItems = [...items];
                newItems[index].Item.name = name;
                return newItems;
            });

            setItems(items => {
                const index = items.findIndex(eq => eq.id === id);
                if (index === -1) return items;

                const newItems = [...items];
                newItems[index].name = name;
                return newItems;
            });
        });

        return () => {
            socket.off('playerItemAdd');
            socket.off('playerItemRemove');
            socket.off('playerItemChange');
        };
    }, [socket]);

    function onAddItem(id: number) {
        api.put('/sheet/player/item', { id }).then(res => {
            const item = res.data.item;
            setPlayerItems([...playerItems, item]);

            const newItems = [...items];
            newItems.splice(newItems.findIndex(eq => eq.id === id), 1);
            setItems(newItems);
        }).catch(logError);
    }

    function onDeleteItem(id: number) {
        const newPlayerItems = [...playerItems];
        const index = newPlayerItems.findIndex(eq => eq.Item.id === id);

        newPlayerItems.splice(index, 1);
        setPlayerItems(newPlayerItems);

        const modalItem = { id, name: playerItems[index].Item.name };
        setItems([...items, modalItem]);
    }

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

    const colorStyle = { color: load > parseFloat(maxLoad) ? 'red' : 'inherit' };

    return (
        <>
            <DataContainer outline title={props.title} addButton={{ onAdd: () => setAddItemShow(true) }}>
                <Row className='text-center justify-content-center'>
                    {props.playerCurrency.map(curr =>
                        <PlayerCurrencyField key={curr.Currency.id} currency={curr} />
                    )}
                </Row>
                <hr />
                <Row>
                    <Col className='text-center h5'>
                        <span className='me-2'>Capacidade:</span>
                        <span style={colorStyle}> {load} /</span>
                        <BottomTextInput value={maxLoad} onChange={ev => setMaxLoad(ev.currentTarget.value)}
                            onBlur={onMaxLoadBlur} className='text-center' style={{ ...colorStyle, maxWidth: '3rem' }} />
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
                                        item={item.Item} quantity={item.quantity} onDelete={onDeleteItem}
                                        onQuantityChange={onQuantityChange} />
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </DataContainer>
            <AddDataModal title='Adicionar' show={addItemShow} onHide={() => setAddItemShow(false)}
                data={items} onAddData={onAddItem} />
        </>
    );
}