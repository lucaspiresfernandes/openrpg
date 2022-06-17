import type { MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DropdownItem from 'react-bootstrap/DropdownItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import PlayerPortraitButton from './PlayerPortraitButton';

const style = { maxWidth: '3rem' };

type NPC = { name: string; id: number };

type NPCContainerProps = {
	npcs: { id: number; name: string }[];
	onAddNpc?: MouseEventHandler;
	onRemoveNpc?: (id: number) => void;
};

export default function NPCContainer(props: NPCContainerProps) {
	const [basicNpcs, setBasicNpcs] = useState<NPC[]>([]);
	const componentDidMount = useRef(false);

	useEffect(() => {
		setBasicNpcs(JSON.parse(localStorage.getItem('admin_npcs') || '[]') as NPC[]);
	}, []);

	useEffect(() => {
		if (componentDidMount.current) {
			localStorage.setItem('admin_npcs', JSON.stringify(basicNpcs));
			return;
		}
		componentDidMount.current = true;
	}, [basicNpcs]);

	function removeBasicNPC(id: number) {
		const newNpcs = [...basicNpcs];
		newNpcs.splice(
			newNpcs.findIndex((npc) => npc.id === id),
			1
		);
		setBasicNpcs(newNpcs);
	}

	const dropdown = (
		<>
			<DropdownItem
				onClick={() =>
					setBasicNpcs([
						...basicNpcs,
						{ id: Date.now(), name: `NPC ${basicNpcs.length}` },
					])
				}>
				Básico
			</DropdownItem>
			<DropdownItem onClick={props.onAddNpc}>Complexo</DropdownItem>
		</>
	);

	return (
		<DataContainer
			xs={12}
			lg
			title='NPCs'
			addButton={{ type: 'dropdown', children: dropdown }}>
			<Row>
				<Col>
					<div className='w-100 wrapper'>
						<ListGroup variant='flush' className='text-center'>
							{basicNpcs.map(({ id, name }) => (
								<ListGroup.Item key={id}>
									<BottomTextInput
										value={name}
										onChange={(ev) => {
											const npc = basicNpcs.find((npc) => npc.id === id);
											if (!npc) return;
											npc.name = ev.target.value;
											setBasicNpcs([...basicNpcs]);
										}}
										className='w-25 mx-1'
									/>
									<BottomTextInput type='number' defaultValue='0' style={style} />
									<Button
										size='sm'
										variant='secondary'
										className='ms-1'
										onClick={() => removeBasicNPC(id)}>
										-
									</Button>
								</ListGroup.Item>
							))}
							{props.npcs.map(({ id, name }) => (
								<ListGroup.Item key={id}>
									<PlayerPortraitButton playerId={id} />
									<Button
										href={`/sheet/npc/${id}/1`}
										target='_blank'
										size='sm'
										variant='secondary'
										className='mx-2'>
										Acessar
									</Button>
									{name}
									<Button
										size='sm'
										variant='secondary'
										className='ms-2'
										onClick={() => props.onRemoveNpc?.(id)}>
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
