import { FormEvent, useState } from 'react';
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

let __id = 0;
function getId() {
	return __id++;
}

type Entity = {
	id: number;
	name: string;
};

type SortableContainerProps = {
	entities: Entity[];
	pointer: number;
	removeEntity(id: number): void;
};

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
	removeEntity(id: number): void;
};

const SortableItem = SortableElement((props: SortableElementProps) => {
	return (
		<ListGroup.Item className={props.selected ? 'selected' : ''}>
			<div className='d-inline-block w-75'>{props.entity.name}</div>
			<Button
				size='sm'
				variant='secondary'
				className='ms-1'
				onClick={() => props.removeEntity(props.entity.id)}>
				-
			</Button>
		</ListGroup.Item>
	);
});

export default function CombatContainer(props: {
	players: { id: number; name: string }[];
}) {
	const [round, setRound] = useState(1);
	const [entities, setEntities] = useState<Entity[]>([]);
	const [pointer, setPointer] = useState(0);

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

	function addNPCEntity() {
		const name = prompt('Digite o nome:');
		if (!name) return;
		setEntities([...entities, { id: getId(), name }]);
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

	const dropdown = (
		<>
			{props.players.map((pl) => {
				if (entities.find((e) => e.name === pl.name)) return null;
				return (
					<Dropdown.Item
						key={pl.id}
						onClick={() => setEntities([...entities, { id: getId(), name: pl.name }])}>
						{pl.name}
					</Dropdown.Item>
				);
			})}
			<Dropdown.Divider />
			<Dropdown.Item onClick={addNPCEntity}>Novo...</Dropdown.Item>
		</>
	);

	return (
		<DataContainer
			xs={12}
			lg
			title='Combate'
			addButton={{ type: 'dropdown', children: dropdown }}>
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
							style={{ maxWidth: '4rem' }}
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
