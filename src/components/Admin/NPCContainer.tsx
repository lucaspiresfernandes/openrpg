import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

const style = { maxWidth: '3rem' };

type NPC = { name: string; id: number };

export default function NPCContainer() {
	const [npcs, setNPCs] = useState<NPC[]>([]);
	const componentDidMount = useRef(false);

	useEffect(() => {
		setNPCs(JSON.parse(localStorage.getItem('admin_npcs') || '[]') as NPC[]);
	}, []);

	useEffect(() => {
		if (componentDidMount.current) {
			localStorage.setItem('admin_npcs', JSON.stringify(npcs));
			return;
		}
		componentDidMount.current = true;
	}, [npcs]);

	function addNewNPC() {
		setNPCs([...npcs, { id: Date.now(), name: `NPC ${npcs.length}` }]);
	}

	function removeNPC(id: number) {
		const newNpcs = [...npcs];
		newNpcs.splice(
			newNpcs.findIndex((npc) => npc.id === id),
			1
		);
		setNPCs(newNpcs);
	}

	return (
		<DataContainer
			xs={12}
			lg
			title='NPCs'
			addButton={{ type: 'button', onAdd: addNewNPC }}>
			<Row>
				<Col>
					<div className='w-100 wrapper'>
						<ListGroup variant='flush' className='text-center'>
							{npcs.map(({ id, name }) => (
								<ListGroup.Item key={id}>
									<BottomTextInput
										value={name}
										onChange={(ev) => {
											const npc = npcs.find((npc) => npc.id === id);
											if (!npc) return;
											npc.name = ev.target.value;
											setNPCs([...npcs]);
										}}
										className='w-25 mx-1'
									/>
									<BottomTextInput type='number' defaultValue='0' style={style} />
									<Button
										size='sm'
										variant='secondary'
										className='ms-1'
										onClick={() => removeNPC(id)}>
										-
									</Button>
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				</Col>
			</Row>
		</DataContainer>
	);
}
