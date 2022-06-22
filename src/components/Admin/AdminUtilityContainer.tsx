import { useContext, useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import AdminDiceRollContainer from './AdminDiceRollContainer';
import CombatContainer from './CombatContainer';
import DiceList from './DiceList';
import NPCContainer from './NPCContainer';
import type { NPC } from './NPCContainer';

type AdminUtilityContainerProps = {
	players: { id: number; name: string }[];
	npcs: { id: number; name: string }[];
};

export default function AdminUtilityContainer(props: AdminUtilityContainerProps) {
	const [basicNpcs, setBasicNpcs] = useState<NPC[]>([]);
	const [complexNpcs, setComplexNpcs] = useState(props.npcs);
	const componentDidMount = useRef(false);
	const socket = useContext(Socket);
	const logError = useContext(ErrorLogger);

	useEffect(() => {
		setBasicNpcs(JSON.parse(localStorage.getItem('admin_npcs') || '[]') as NPC[]);

		socket.on('playerNameChange', (playerId, value) => {
			const npc = complexNpcs.find((npc) => npc.id === playerId);
			if (!npc) return;
			npc.name = value;
			setComplexNpcs([...complexNpcs]);
		});

		return () => {
			socket.off('playerNameChange');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (componentDidMount.current) {
			localStorage.setItem('admin_npcs', JSON.stringify(basicNpcs));
			return;
		}
		componentDidMount.current = true;
	}, [basicNpcs]);

	function addBasicNPC() {
		setBasicNpcs([...basicNpcs, { id: Date.now(), name: `NPC ${basicNpcs.length}` }]);
	}

	function removeBasicNPC(id: number) {
		const newNpcs = [...basicNpcs];
		newNpcs.splice(
			newNpcs.findIndex((npc) => npc.id === id),
			1
		);
		setBasicNpcs(newNpcs);
	}

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
				<CombatContainer players={[...props.players, ...basicNpcs, ...complexNpcs]} />
			</Row>
			<Row className='mb-5'>
				<DiceList players={props.players} />
				<NPCContainer
					basicNpcs={basicNpcs}
					complexNpcs={complexNpcs}
					onAddBasicNpc={addBasicNPC}
					onRemoveBasicNpc={removeBasicNPC}
					onChangeBasicNpc={(ev, id) => {
						const npc = basicNpcs.find((npc) => npc.id === id);
						if (!npc) return;
						npc.name = ev.target.value;
						setBasicNpcs([...basicNpcs]);
					}}
					onAddComplexNpc={addComplexNPC}
					onRemoveComplexNpc={removeComplexNPC}
				/>
			</Row>
		</>
	);
}
