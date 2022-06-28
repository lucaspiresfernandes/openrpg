import { useContext, useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import DataContainer from '../DataContainer';
import GeneralDiceRollModal from '../Modals/GeneralDiceRollModal';
import CombatContainer from './CombatContainer';
import DiceList from './DiceList';
import NPCContainer from './NPCContainer';

type NPC = { name: string; id: number; npc: boolean };

type AdminUtilityContainerProps = {
	players: { id: number; name: string; npc: boolean }[];
	npcs: { id: number; name: string }[];
};

export default function AdminUtilityContainer(props: AdminUtilityContainerProps) {
	const [basicNpcs, setBasicNpcs] = useState<NPC[]>([]);
	const [complexNpcs, setComplexNpcs] = useState(
		props.npcs.map((n) => ({ ...n, npc: true }))
	);
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
		setBasicNpcs([
			...basicNpcs,
			{ id: Date.now(), name: `NPC ${basicNpcs.length}`, npc: true },
		]);
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
				setComplexNpcs([...complexNpcs, { id, name, npc: true }]);
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
				<DataContainer xs={12} lg className='mb-5 mb-lg-0' title='Rolagem'>
					<Row className='mb-3 justify-content-center'>
						<Col xs={3}>
							<Row>
								<Col className='h5'>Geral</Col>
							</Row>
							<Row>
								<GeneralDiceRollModal />
							</Row>
						</Col>
					</Row>
				</DataContainer>
				<DiceList players={props.players} />
			</Row>
			<Row className='mb-5 text-center'>
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
				<CombatContainer players={[...props.players, ...basicNpcs, ...complexNpcs]} />
			</Row>
		</>
	);
}
