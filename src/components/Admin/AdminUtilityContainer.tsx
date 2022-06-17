import { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import AdminDiceRollContainer from './AdminDiceRollContainer';
import CombatContainer from './CombatContainer';
import DiceList from './DiceList';
import NPCContainer from './NPCContainer';

type AdminUtilityContainerProps = {
	players: { id: number; name: string }[];
	npcs: { id: number; name: string }[];
};

export default function AdminUtilityContainer(props: AdminUtilityContainerProps) {
	const [complexNpcs, setComplexNpcs] = useState(props.npcs);
	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	useEffect(() => {
		socket.on('playerNameChange', (playerId, value) => {
			const npc = complexNpcs.find((npc) => npc.id === playerId);
			if (!npc) return;
			npc.name = value;
			setComplexNpcs([...complexNpcs]);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function addComplexNPC() {
		const name = prompt('Digite o nome do NPC:');
		if (!name) return;
		api
			.put('/sheet/npc', { name })
			.then((res) => {
				const id = res.data.id;
				setComplexNpcs([...complexNpcs, { id, name }]);
			})
			.catch(logError);
	}

	function removeComplexNPC(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse NPC?')) return;
		api
			.delete('/sheet/npc', { data: { id } })
			.then(() => {
				const newNpcs = [...complexNpcs];
				newNpcs.splice(
					newNpcs.findIndex((npc) => npc.id === id),
					1
				);
				setComplexNpcs(newNpcs);
			})
			.catch(logError);
	}

	return (
		<>
			<Row className='my-5 text-center'>
				<AdminDiceRollContainer />
				<CombatContainer players={[...props.players, ...complexNpcs]} />
			</Row>
			<Row className='mb-5'>
				<DiceList players={props.players} />
				<NPCContainer
					npcs={complexNpcs}
					onAddNpc={addComplexNPC}
					onRemoveNpc={removeComplexNPC}
				/>
			</Row>
		</>
	);
}
