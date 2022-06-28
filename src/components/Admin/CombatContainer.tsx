import { useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { clamp } from '../../utils';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

type Entity = {
	id: number;
	name: string;
};

type SortableContainerProps = {
	entities: Entity[];
	pointer: number;
	removeEntity: (id: number) => void;
};

const style = { maxWidth: '4rem' };

const SortableList = SortableContainer((props: SortableContainerProps) => {
	return (
		<ListGroup variant='flush' className='text-center'>
			{props.entities.map((entity, index) => (
				<SortableItem
					key={entity.id}
					index={index}
					entity={entity}
					selected={props.pointer === index}
					removeEntity={props.removeEntity}
				/>
			))}
		</ListGroup>
	);
});

type SortableElementProps = {
	entity: Entity;
	selected?: boolean;
	removeEntity: (id: number) => void;
};

const SortableItem = SortableElement((props: SortableElementProps) => {
	return (
		<ListGroup.Item className={props.selected ? 'selected' : ''}>
			<div className='d-inline-block'>{props.entity.name || 'Desconhecido'}</div>
			<BottomTextInput className='mx-2 text-center' defaultValue='0' style={style} />
			<Button
				size='sm'
				variant='secondary'
				onClick={() => props.removeEntity(props.entity.id)}>
				-
			</Button>
		</ListGroup.Item>
	);
});

type Storage = {
	round?: number;
	entities?: Entity[];
	pointer?: number;
};

export default function CombatContainer(props: {
	players: { id: number; name: string; npc: boolean }[];
}) {
	const [round, setRound] = useState(1);
	const [entities, setEntities] = useState<Entity[]>([]);
	const [pointer, setPointer] = useState(0);
	const componentDidMount = useRef(false);

	useEffect(() => {
		const storage: Storage = JSON.parse(localStorage.getItem('admin_combat') || '{}');
		if (storage.round) setRound(storage.round);
		if (storage.entities) setEntities(storage.entities);
		if (storage.pointer) setPointer(storage.pointer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (componentDidMount.current) {
			localStorage.setItem(
				'admin_combat',
				JSON.stringify({
					round,
					entities,
					pointer,
				})
			);
			return;
		}
		componentDidMount.current = true;
	}, [round, entities, pointer]);

	useEffect(() => {
		let change = false;

		const newEntities = [...entities];
		for (let entityIndex = 0; entityIndex < entities.length; entityIndex++) {
			const entity = entities[entityIndex];
			const npcIndex = props.players.findIndex((p) => p.id === entity.id);
			if (npcIndex > -1) {
				const npc = props.players[npcIndex];
				if (npc.name === entity.name) continue;
				entity.name = npc.name;
				change = true;
			} else {
				newEntities.splice(entityIndex, 1);
				change = true;
			}
		}

		if (change) setEntities(newEntities);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.players]);

	function roundUpdate(ev: FormEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newRound = parseInt(aux);
		if (aux.length === 0) newRound = 1;
		else if (isNaN(newRound)) return;
		setRound(clamp(newRound, 1, 100));
	}

	function onSortEnd({ oldIndex, newIndex }: SortEnd) {
		if (oldIndex === newIndex) return;
		setEntities((entities) => {
			const newEntities = [...entities];
			const aux = newEntities.splice(oldIndex, 1)[0];
			newEntities.splice(newIndex, 0, aux);
			return newEntities;
		});
		if (oldIndex === pointer) return setPointer(newIndex);
		if (newIndex >= pointer && oldIndex < pointer) return setPointer(pointer - 1);
		if (oldIndex > pointer && newIndex <= pointer) return setPointer(pointer + 1);
	}

	function movePointer(coeff: number) {
		if (coeff === 0 || entities.length < 2) return;

		let currentIndex = pointer + coeff;
		if (currentIndex < 0) currentIndex = entities.length - 1;
		else if (currentIndex >= entities.length) currentIndex = 0;

		if (coeff > 0) {
			if (currentIndex === 0 && pointer === entities.length - 1) setRound(round + 1);
		} else if (currentIndex === entities.length - 1 && pointer === 0 && round > 1)
			setRound(round - 1);

		setPointer(currentIndex);
	}

	function removeEntity(id: number) {
		const index = entities.findIndex((e) => e.id === id);
		if (index < pointer) setPointer(pointer - 1);
		const newEntities = [...entities];
		newEntities.splice(index, 1);
		setEntities(newEntities);
	}

	function emptyList() {
		setEntities([]);
		setPointer(0);
		setRound(1);
	}

	return (
		<DataContainer
			xs={12}
			lg
			title='Combate'
			addButton={{
				type: 'dropdown',
				children: props.players.map((pl) => {
					if (entities.find((e) => e.id === pl.id)) return null;
					return (
						<Dropdown.Item
							key={pl.id}
							onClick={() => setEntities([...entities, { ...pl }])}>
							{pl.name || 'Desconhecido'}
						</Dropdown.Item>
					);
				}),
			}}>
			<Row className='my-2'>
				<Col>
					<FormGroup controlId='combatRound'>
						<FormLabel className='h5'>Rodada:</FormLabel>
						<BottomTextInput
							id='combatRound'
							type='number'
							className='ms-2 h4'
							value={round}
							onChange={roundUpdate}
							style={style}
						/>
					</FormGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className='w-100 wrapper'>
						<SortableList
							entities={entities}
							onSortEnd={onSortEnd}
							pointer={pointer}
							removeEntity={removeEntity}
						/>
					</div>
				</Col>
			</Row>
			<Row className='mt-3 justify-content-center'>
				<Col>
					<Button size='sm' variant='secondary' onClick={() => movePointer(-1)}>
						Anterior
					</Button>
				</Col>
				<Col>
					<Button size='sm' variant='secondary' onClick={emptyList}>
						Limpar
					</Button>
				</Col>
				<Col>
					<Button size='sm' variant='secondary' onClick={() => movePointer(1)}>
						Próximo
					</Button>
				</Col>
			</Row>
		</DataContainer>
	);
}
