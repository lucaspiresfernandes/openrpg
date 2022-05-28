import type { Spell } from '@prisma/client';
import { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Spell = {
	id: 0,
	name: '',
	description: '',
	castingTime: '',
	cost: '',
	damage: '',
	duration: '',
	range: '',
	target: '',
	type: '',
	slots: 0,
	visible: true,
};

export default function SpellEditorModal(props: EditorModalProps<Spell>) {
	const [spell, setSpell] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setSpell(props.data);
	}, [props.data]);

	function hide() {
		setSpell(initialState);
		props.onHide();
	}

	function onSlotsChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.target.value;
		let newSlots = parseInt(aux);

		if (aux.length === 0) newSlots = 0;
		else if (isNaN(newSlots)) return;

		setSpell((sp) => ({ ...sp, slots: newSlots }));
	}

	return (
		<SheetModal
			animation={false}
			title={props.operation === 'create' ? 'Criar' : 'Editar'}
			show={props.show}
			onHide={hide}
			applyButton={{
				name: props.operation === 'create' ? 'Criar' : 'Editar',
				onApply: () => {
					props.onSubmit(spell);
					hide();
				},
				disabled: props.disabled,
			}}
			scrollable>
			<Container fluid>
				<FormGroup controlId='createSpellName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={spell.name}
						onChange={(ev) => setSpell((sp) => ({ ...sp, name: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellDescription' className='mb-3'>
					<FormLabel>Descrição</FormLabel>

					<FormControl
						as='textarea'
						className='theme-element'
						value={spell.description}
						onChange={(ev) => setSpell((sp) => ({ ...sp, description: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellCost' className='mb-3'>
					<FormLabel>Custo</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.cost}
						onChange={(ev) => setSpell((sp) => ({ ...sp, cost: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellType' className='mb-3'>
					<FormLabel>Tipo</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.type}
						onChange={(ev) => setSpell((sp) => ({ ...sp, type: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellDamage' className='mb-3'>
					<FormLabel>Dano</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.damage}
						onChange={(ev) => setSpell((sp) => ({ ...sp, damage: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellTarget' className='mb-3'>
					<FormLabel>Alvo</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.target}
						onChange={(ev) => setSpell((sp) => ({ ...sp, target: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellCastingTime' className='mb-3'>
					<FormLabel>Tempo de Conjuração</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.castingTime}
						onChange={(ev) => setSpell((sp) => ({ ...sp, castingTime: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellRange' className='mb-3'>
					<FormLabel>Alcance</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.range}
						onChange={(ev) => setSpell((sp) => ({ ...sp, range: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellDuration' className='mb-3'>
					<FormLabel>Duração</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.duration}
						onChange={(ev) => setSpell((sp) => ({ ...sp, duration: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createSpellSlots' className='mb-3'>
					<FormLabel>Espaços</FormLabel>
					<FormControl
						className='theme-element'
						value={spell.slots}
						onChange={onSlotsChange}
					/>
				</FormGroup>

				<FormCheck
					inline
					checked={spell.visible}
					onChange={(ev) => setSpell((sp) => ({ ...sp, visible: ev.target.checked }))}
					id='createSpellVisible'
					label='Visível?'
				/>
			</Container>
		</SheetModal>
	);
}
