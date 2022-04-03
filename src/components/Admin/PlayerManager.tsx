import { Attribute, AttributeStatus, Currency, Equipment, Info, Spec } from '@prisma/client';
import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import AvatarField from './AvatarField';

type PlayerItem = {
    Item: {
        id: number;
        name: string;
        description: string;
        weight: number;
    };
    currentDescription: string;
    quantity: number;
};

type PlayerManagerProps = {
    players: {
        id: number;
        maxLoad: number;
        PlayerAttributeStatus: {
            AttributeStatus: AttributeStatus;
            value: boolean;
        }[];
        PlayerInfo: {
            Info: Info;
            value: string;
        }[];
        PlayerAttributes: {
            Attribute: Attribute;
            value: number;
            maxValue: number;
        }[];
        PlayerSpec: {
            Spec: Spec;
            value: string;
        }[];
        PlayerEquipment: {
            Equipment: Equipment;
            currentAmmo: number | null;
        }[];
        PlayerItem: PlayerItem[];
        PlayerCurrency: {
            value: string;
            Currency: Currency;
        }[];
    }[];
};

export default function PlayerManager({ players: _players }: PlayerManagerProps) {
    const [players, setPlayers] = useState(_players);
    const socket = useContext(Socket);
    const logError = useContext(ErrorLogger);

    function onDeletePlayer(id: number) {
        if (!confirm('Tem certeza que deseja apagar esse jogador?')) return;
        api.delete('/sheet/player', { data: { id } }).then(() => {
            const newPlayers = [...players];
            newPlayers.splice(players.findIndex(p => p.id === id), 1);
            setPlayers(newPlayers);
        }).catch(logError);
    }

    useEffect(() => {
        if (!socket) return;

        socket.on('attributeStatusChange', (playerId, attrStatusID, value) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const index = player.PlayerAttributeStatus.findIndex(curr => curr.AttributeStatus.id === attrStatusID);
            if (index === -1) return players;
            player.PlayerAttributeStatus[index].value = value;
            return newPlayers;
        }));

        socket.on('infoChange', (playerId, infoID, value) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const index = player.PlayerInfo.findIndex(curr => curr.Info.id === infoID);
            if (index === -1) return players;
            player.PlayerInfo[index].value = value;
            return newPlayers;
        }));

        socket.on('attributeChange', (playerId, attributeID, value, maxValue) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const index = player.PlayerAttributes.findIndex(curr => curr.Attribute.id === attributeID);
            if (index === -1) return players;
            if (value !== null) player.PlayerAttributes[index].value = value;
            if (maxValue !== null) player.PlayerAttributes[index].maxValue = maxValue;
            return newPlayers;
        }));

        socket.on('specChange', (playerId, specID, value) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const index = player.PlayerSpec.findIndex(curr => curr.Spec.id === specID);
            if (index === -1) return players;
            player.PlayerSpec[index].value = value;
            return newPlayers;
        }));

        socket.on('currencyChange', (playerId, currencyId, value) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const index = player.PlayerCurrency.findIndex(curr => curr.Currency.id === currencyId);
            if (index === -1) return players;
            player.PlayerCurrency[index].value = value;
            return newPlayers;
        }));

        socket.on('equipmentAdd', (playerId, playerEquipment) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            player.PlayerEquipment = [...player.PlayerEquipment, playerEquipment];
            return newPlayers;
        }));

        socket.on('equipmentRemove', (playerId, equipID) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const newEquipments = [...player.PlayerEquipment];
            const index = newEquipments.findIndex(equip => equip.Equipment.id === equipID);
            if (index === -1) return players;
            newEquipments.splice(index, 1);
            player.PlayerEquipment = newEquipments;
            return newPlayers;
        }));

        socket.on('itemAdd', (playerId, playerItem) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            player.PlayerItem = [...player.PlayerItem, playerItem];
            return newPlayers;
        }));

        socket.on('itemRemove', (playerId, itemID) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const newItems = [...player.PlayerItem];
            const index = newItems.findIndex(item => item.Item.id === itemID);
            if (index === -1) return players;
            newItems.splice(index, 1);
            player.PlayerItem = newItems;
            return newPlayers;
        }));

        socket.on('itemChange', (playerId, itemID, currentDescription, quantity) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            const newItems = [...player.PlayerItem];
            const index = newItems.findIndex(item => item.Item.id === itemID);
            if (index === -1) return players;
            if (currentDescription !== null) newItems[index].currentDescription = currentDescription;
            if (quantity !== null) newItems[index].quantity = quantity;
            return newPlayers;
        }));

        socket.on('maxLoadChange', (playerId, newLoad) => setPlayers(players => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerId);
            if (!player) return players;
            player.maxLoad = newLoad;
            return newPlayers;
        }));

        return () => {
            socket.off('infoChange');
            socket.off('attributeChange');
            socket.off('specChange');
            socket.off('currencyChange');
            socket.off('equipmentAdd');
            socket.off('equipmentRemove');
            socket.off('itemAdd');
            socket.off('itemRemove');
            socket.off('itemChange');
            socket.off('maxLoadChange');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    if (players.length === 0) return (
        <Col className='h2 text-center' style={{ color: 'gray' }}>
            Não há nenhum jogador cadastrado.
        </Col>
    );

    function ItemHeader({ playerItem, maxLoad }: { playerItem: PlayerItem[], maxLoad: number }) {
        const load = playerItem.reduce((prev, cur) => prev + cur.Item.weight * cur.quantity, 0);
        return (
            <>
                Peso Atual: <span style={{ color: load > maxLoad ? 'red' : '' }}>
                    {load}/{maxLoad}
                </span>
            </>
        );
    }

    return (
        <>
            {players.map(player =>
                <Col key={player.id} xs={12} md={6} xl={4} className='text-center h-100 my-2'>
                    <Row className='mx-md-1 player-container'>
                        <Col>
                            <Row className='my-2'>
                                <Col>
                                    <Button size='sm' variant='secondary' onClick={() => onDeletePlayer(player.id)}>
                                        Apagar
                                    </Button>
                                </Col>
                                <Col>
                                    <Button size='sm' variant='secondary' onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.host}/portrait/${player.id}`);
                                        alert('Link copiado para sua área de transferência.');
                                    }}>
                                        Retrato
                                    </Button>
                                </Col>
                            </Row>
                            <AvatarField playerId={player.id}
                                status={player.PlayerAttributeStatus.map(stat => { return { id: stat.AttributeStatus.id, value: stat.value }; })} />
                            <Row className='mt-2'>
                                {player.PlayerInfo.map(info =>
                                    <Col key={info.Info.id}>
                                        <Row><Col className='h5'>{info.value || 'Desconhecido'}</Col></Row>
                                    </Col>
                                )}
                            </Row>
                            <hr />
                            <Row>
                                {player.PlayerAttributes.map(attr =>
                                    <Col key={attr.Attribute.id}>
                                        <Row>
                                            <Col className='h5' style={{ color: `#${attr.Attribute.color}` }}>
                                                {attr.value}/{attr.maxValue}
                                            </Col>
                                        </Row>
                                        <Row><Col>{attr.Attribute.name}</Col></Row>
                                    </Col>
                                )}
                            </Row>
                            <hr />
                            <Row>
                                {player.PlayerSpec.map(spec =>
                                    <Col key={spec.Spec.id}>
                                        <Row><Col className='h5'>{spec.value || '0'}</Col></Row>
                                        <Row><Col>{spec.Spec.name}</Col></Row>
                                    </Col>
                                )}
                            </Row>
                            <hr />
                            <Row>
                                {player.PlayerCurrency.map(curr =>
                                    <Col key={curr.Currency.id}>
                                        <Row><Col className='h5'>{curr.value || '0'}</Col></Row>
                                        <Row><Col>{curr.Currency.name}</Col></Row>
                                    </Col>
                                )}
                            </Row>
                            <hr />
                            <Row>
                                <Col className='h3'>
                                    Equipamentos
                                </Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Dano</th>
                                                <th>Tipo</th>
                                                <th>Alcance</th>
                                                <th>Ataques</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {player.PlayerEquipment.map(equip =>
                                                <tr key={equip.Equipment.id}>
                                                    <td>{equip.Equipment.name}</td>
                                                    <td>{equip.Equipment.damage}</td>
                                                    <td>{equip.Equipment.type}</td>
                                                    <td>{equip.Equipment.range}</td>
                                                    <td>{equip.Equipment.attacks}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='h3'>
                                    Inventário
                                </Col>
                            </Row>
                            <Row className='mb-2 h6'>
                                <Col>
                                    <ItemHeader playerItem={player.PlayerItem} maxLoad={player.maxLoad} />
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col>
                                    {player.PlayerItem.map(item =>
                                        <Row key={item.Item.id} className='mb-2'>
                                            <Col title={`${item.currentDescription} (Peso: ${item.Item.weight})`}>
                                                {item.Item.name} ({item.quantity})
                                            </Col>
                                        </Row>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            )}
        </>
    );
}