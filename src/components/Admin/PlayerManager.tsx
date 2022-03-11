import { Attribute, AttributeStatus, Characteristic, Equipment, Info, Spec } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import { RetrieveSocket } from '../../contexts';
import PlayerContainer from './PlayerContainer';

type PlayerManagerProps = {
    players: Player[]
}

type Player = {
    id: number;
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
    PlayerCharacteristic: {
        Characteristic: Characteristic;
        value: number;
    }[];
    PlayerEquipment: {
        Equipment: Equipment;
        currentAmmo: number | null;
        using: boolean;
    }[];
    PlayerItem: {
        Item: {
            id: number;
            name: string;
            description: string;
        };
        currentDescription: string;
        quantity: number;
    }[];
}

export default function PlayerManager(props: PlayerManagerProps) {
    const [players, setPlayers] = useState(props.players);
    const socket = useContext(RetrieveSocket);

    function deletePlayer(index: number) {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
    }

    useEffect(() => {
        if (!socket) return;

        socket.on('attributeStatusChange', (playerID, attrStatusID, value) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newAttrStatus = [...player.PlayerAttributeStatus];
            const index = newAttrStatus.findIndex(stat => stat.AttributeStatus.id === attrStatusID);
            if (index > -1) {
                newAttrStatus[index].value = value;
                setPlayers(newPlayers);
            }
        });

        socket.on('infoChange', (playerID, infoID, value) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newInfo = [...player.PlayerInfo];
            const index = newInfo.findIndex(info => info.Info.id === infoID);
            if (index > -1) {
                newInfo[index].value = value;
                setPlayers(newPlayers);
            }
        });

        socket.on('attributeChange', (playerID, attributeID, value, maxValue) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newAttributes = [...player.PlayerAttributes];
            const index = newAttributes.findIndex(attr => attr.Attribute.id === attributeID);
            if (index > -1) {
                if (value !== null) newAttributes[index].value = value;
                if (maxValue !== null) newAttributes[index].maxValue = maxValue;
                setPlayers(newPlayers);
            }
        });


        socket.on('specChange', (playerID, specID, value) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newSpec = [...player.PlayerSpec];
            const index = newSpec.findIndex(spec => spec.Spec.id === specID);
            if (index > -1) {
                newSpec[index].value = value;
                setPlayers(newPlayers);
            }
        });


        socket.on('characteristicChange', (playerID, charID, value) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newSpec = [...player.PlayerCharacteristic];
            const index = newSpec.findIndex(spec => spec.Characteristic.id === charID);
            if (index > -1) {
                newSpec[index].value = value;
                setPlayers(newPlayers);
            }
        });

        socket.on('equipmentAdd', (playerID, playerEquipment) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            player.PlayerEquipment = [...player.PlayerEquipment, playerEquipment];
            setPlayers(newPlayers);
        });

        socket.on('equipmentRemove', (playerID, equipID) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newEquipments = [...player.PlayerEquipment];
            const index = newEquipments.findIndex(equip => equip.Equipment.id === equipID);
            if (index > -1) {
                newEquipments.splice(index, 1);
                player.PlayerEquipment = newEquipments;
                setPlayers(newPlayers);
            }
        });

        socket.on('itemAdd', (playerID, playerItem) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            player.PlayerItem = [...player.PlayerItem, playerItem];
            setPlayers(newPlayers);
        });

        socket.on('itemRemove', (playerID, itemID) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newItems = [...player.PlayerItem];
            const index = newItems.findIndex(item => item.Item.id === itemID);
            if (index > -1) {
                newItems.splice(index, 1);
                player.PlayerItem = newItems;
                setPlayers(newPlayers);
            }
        });

        socket.on('itemChange', (playerID, itemID, currentDescription, quantity) => {
            const newPlayers = [...players];
            const player = newPlayers.find(p => p.id === playerID);
            if (!player) return;

            const newItems = [...player.PlayerItem];
            const index = newItems.findIndex(item => item.Item.id === itemID);
            if (index > -1) {
                if (currentDescription !== null) newItems[index].currentDescription = currentDescription;
                if (quantity !== null) newItems[index].quantity = quantity;
                setPlayers(newPlayers);
            }
        });

        return () => {
            socket.off('infoChange');
            socket.off('attributeChange');
            socket.off('specChange');
            socket.off('characteristicChange');
            socket.off('equipmentAdd');
            socket.off('equipmentRemove');
            socket.off('itemAdd');
            socket.off('itemRemove');
            socket.off('itemChange');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            {players.map((player, index) =>
                <PlayerContainer key={player.id} id={player.id} status={player.PlayerAttributeStatus}
                    info={player.PlayerInfo} attributes={player.PlayerAttributes}
                    specs={player.PlayerSpec} characteristics={player.PlayerCharacteristic}
                    equipments={player.PlayerEquipment} items={player.PlayerItem}
                    onDelete={() => deletePlayer(index)} />
            )}
        </>
    );
}