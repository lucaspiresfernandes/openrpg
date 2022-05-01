import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

type CreateSpellModalProps = {
	onCreate(
		name: string,
		description: string,
		cost: string,
		type: string,
		damage: string,
		castingTime: string,
		range: string,
		duration: string,
		slots: number,
		target: string
	): void;
	show: boolean;
	onHide(): void;
};

export default function CreateSpellModal(props: CreateSpellModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [cost, setCost] = useState('');
	const [type, setType] = useState('Nenhum');
	const [damage, setDamage] = useState('');
	const [target, setTarget] = useState('');
	const [castingTime, setCastingTime] = useState('');
	const [range, setRange] = useState('');
	const [duration, setDuration] = useState('');
	const [slots, setSlots] = useState(1);

	function reset() {
		setName('');
		setDescription('');
		setCost('');
		setType('Nenhum');
		setDamage('');
		setTarget('');
		setCastingTime('');
		setRange('');
		setDuration('');
	}

	function onSlotsChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newSlots = parseInt(aux);

		if (aux.length === 0) newSlots = 0;
		else if (isNaN(newSlots)) return;

		setSlots(newSlots);
	}

	return (
		<SheetModal
			title='Nova Magia'
			show={props.show}
			onHide={props.onHide}
			onExited={reset}
			applyButton={{
				name: 'Criar',
				onApply: () =>
					props.onCreate(
						name,
						description,
						cost,
						type,
						damage,
						castingTime,
						range,
						duration,
						slots,
						target
					),
			}}
			scrollable>
			<Container fluid>
				<FormGroup controlId='createSpellName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						className='theme-element'
						value={name}
						onChange={(ev) => setName(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellDescription' className='mb-3'>
					<FormLabel>Descrição</FormLabel>

					<FormControl
						as='textarea'
						className='theme-element'
						value={description}
						onChange={(ev) => setDescription(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellCost' className='mb-3'>
					<FormLabel>Custo</FormLabel>
					<FormControl
						className='theme-element'
						value={cost}
						onChange={(ev) => setCost(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellType' className='mb-3'>
					<FormLabel>Tipo</FormLabel>
					<FormControl
						className='theme-element'
						value={type}
						onChange={(ev) => setType(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellDamage' className='mb-3'>
					<FormLabel>Dano</FormLabel>
					<FormControl
						className='theme-element'
						value={damage}
						onChange={(ev) => setDamage(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellTarget' className='mb-3'>
					<FormLabel>Alvo</FormLabel>
					<FormControl
						className='theme-element'
						value={target}
						onChange={(ev) => setTarget(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellCastingTime' className='mb-3'>
					<FormLabel>Tempo de Conjuração</FormLabel>
					<FormControl
						className='theme-element'
						value={castingTime}
						onChange={(ev) => setCastingTime(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellRange' className='mb-3'>
					<FormLabel>Alcance</FormLabel>
					<FormControl
						className='theme-element'
						value={range}
						onChange={(ev) => setRange(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellDuration' className='mb-3'>
					<FormLabel>Duração</FormLabel>
					<FormControl
						className='theme-element'
						value={duration}
						onChange={(ev) => setDuration(ev.currentTarget.value)}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellSlots' className='mb-3'>
					<FormLabel>Espaços</FormLabel>
					<FormControl className='theme-element' value={slots} onChange={onSlotsChange} />
				</FormGroup>
			</Container>
		</SheetModal>
	);
}
