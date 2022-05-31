import type { Equipment } from '@prisma/client';
import { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import SheetModal from './SheetModal';

const initialState: Equipment = {
	id: 0,
	ammo: 0,
	attacks: '1',
	damage: '1d3',
	name: '',
	range: '-',
	type: 'Comum',
	visible: true,
};

export default function EquipmentEditorModal(props: EditorModalProps<Equipment>) {
	const [equipment, setEquipment] = useState(initialState);

	useEffect(() => {
		if (!props.data) return;
		setEquipment(props.data);
	}, [props.data]);

	function hide() {
		setEquipment(initialState);
		props.onHide();
	}

	function onAmmoChange(ev: ChangeEvent<HTMLInputElement>) {
		if (equipment.ammo === null) return;

		const aux = ev.currentTarget.value;
		let newAmmo = parseInt(aux);

		if (aux.length === 0) newAmmo = 0;
		else if (isNaN(newAmmo)) return;

		setEquipment((eq) => ({ ...eq, ammo: newAmmo }));
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
					props.onSubmit(equipment);
					hide();
				},
				disabled: props.disabled,
			}}
			scrollable>
			<Container fluid>
				<FormGroup controlId='createEquipmentName' className='mb-3'>
					<FormLabel>Nome</FormLabel>
					<FormControl
						autoFocus
						className='theme-element'
						value={equipment.name}
						onChange={(ev) => setEquipment((eq) => ({ ...eq, name: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createEquipmentType' className='mb-3'>
					<FormLabel>Tipo</FormLabel>
					<FormControl
						className='theme-element'
						value={equipment.type}
						onChange={(ev) => setEquipment((eq) => ({ ...eq, type: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createEquipmentDamage' className='mb-3'>
					<FormLabel>Dano</FormLabel>
					<FormControl
						className='theme-element'
						value={equipment.damage}
						onChange={(ev) => setEquipment((eq) => ({ ...eq, damage: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createEquipmentRange' className='mb-3'>
					<FormLabel>Alcance</FormLabel>
					<FormControl
						className='theme-element'
						value={equipment.range}
						onChange={(ev) => setEquipment((eq) => ({ ...eq, range: ev.target.value }))}
					/>
				</FormGroup>

				<FormGroup controlId='createEquipmentAttacks' className='mb-3'>
					<FormLabel>Ataques</FormLabel>
					<FormControl
						className='theme-element'
						value={equipment.attacks}
						onChange={(ev) => setEquipment((eq) => ({ ...eq, attacks: ev.target.value }))}
					/>
				</FormGroup>

				<FormCheck
					inline
					checked={equipment.ammo !== null}
					onChange={(ev) =>
						setEquipment((eq) => ({ ...eq, ammo: ev.target.checked ? 0 : null }))
					}
					id='createEquipmentRollable'
					label='Possui munição?'
				/>

				<FormCheck
					inline
					checked={equipment.visible}
					onChange={(ev) => setEquipment((eq) => ({ ...eq, visible: ev.target.checked }))}
					id='createEquipmentVisible'
					label='Visível?'
				/>

				{equipment.ammo != null && (
					<FormGroup controlId='createEquipmentAmmo' className='mb-3'>
						<FormLabel>Munição</FormLabel>
						<FormControl
							className='theme-element'
							value={equipment.ammo}
							onChange={onAmmoChange}
						/>
					</FormGroup>
				)}
			</Container>
		</SheetModal>
	);
}
