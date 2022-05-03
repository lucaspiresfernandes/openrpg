import type { Characteristic } from '@prisma/client';
import type { ChangeEvent } from 'react';
import { useContext, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import type { DiceRollEvent } from '../../hooks/useDiceRoll';
import useDiceRoll from '../../hooks/useDiceRoll';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import type { DiceConfigCell } from '../../utils/config';
import BottomTextInput from '../BottomTextInput';
import DiceRollResultModal from '../Modals/DiceRollResultModal';

type PlayerCharacteristicContainerProps = {
	playerCharacteristics: {
		value: number;
		Characteristic: Characteristic;
		modifier: string;
	}[];
	characteristicDiceConfig: DiceConfigCell;
};

export default function PlayerCharacteristicContainer(
	props: PlayerCharacteristicContainerProps
) {
	const [diceRollResultModalProps, onDiceRoll] = useDiceRoll();
	return (
		<>
			<Row className='mb-3 text-center align-items-end justify-content-center'>
				{props.playerCharacteristics.map((char) => (
					<PlayerCharacteristicField
						key={char.Characteristic.id}
						modifier={char.modifier}
						characteristic={char.Characteristic}
						value={char.value}
						characteristicDiceConfig={props.characteristicDiceConfig}
						showDiceRollResult={onDiceRoll}
					/>
				))}
			</Row>
			<DiceRollResultModal {...diceRollResultModalProps} />
		</>
	);
}

type PlayerCharacteristicFieldProps = {
	characteristicDiceConfig: {
		value: number;
		branched: boolean;
	};
	value: number;
	modifier: string;
	characteristic: Characteristic;
	showDiceRollResult: DiceRollEvent;
};

function PlayerCharacteristicField(props: PlayerCharacteristicFieldProps) {
	const [lastValue, value, setValue] = useExtendedState(props.value);
	const [modifier, setModifier] = useState(props.modifier);
	const lastModifier = useRef(modifier);
	const logError = useContext(ErrorLogger);

	const charID = props.characteristic.id;

	function onChange(ev: ChangeEvent<HTMLInputElement>) {
		const aux = ev.currentTarget.value;
		let newValue = parseInt(aux);

		if (aux.length === 0) newValue = 0;
		else if (isNaN(newValue)) return;

		setValue(newValue);
	}

	function onValueBlur() {
		if (value === lastValue) return;
		setValue(value);
		api.post('/sheet/player/characteristic', { value, id: charID }).catch(logError);
	}

	function onModifierBlur() {
		const num = parseInt(modifier);

		let newModifier = modifier;
		if (isNaN(num)) newModifier = '+0';
		else if (newModifier === '-0') newModifier = '+0';
		else if (newModifier.length === 1) newModifier = `+${num}`;

		if (modifier !== newModifier) setModifier(newModifier);

		if (newModifier === lastModifier.current) return;
		lastModifier.current = newModifier;
		api
			.post('/sheet/player/characteristic', { modifier: newModifier, id: charID })
			.catch(logError);
	}

	function rollDice() {
		const roll = props.characteristicDiceConfig['value'] as number;
		const branched = props.characteristicDiceConfig['branched'] as boolean;
		props.showDiceRollResult(
			[{ num: 1, roll, ref: Math.max(1, value + parseInt(modifier)) }],
			`${roll}${branched ? 'b' : ''}`
		);
	}

	return (
		<Col xs={6} md={4} xl={3} className='my-2'>
			<Row>
				<Col className='mb-2'>
					<Image
						fluid
						alt='Dado'
						className='clickable'
						src='/dice20.png'
						onClick={rollDice}
						style={{ maxHeight: 50 }}
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<label htmlFor={`char${props.characteristic.id}`}>
						{props.characteristic.name}
					</label>
				</Col>
			</Row>
			<Row className='justify-content-center mb-2'>
				<Col xs={3}>
					<BottomTextInput
						className='text-center w-100'
						value={modifier}
						onChange={(ev) => setModifier(ev.currentTarget.value)}
						onBlur={onModifierBlur}
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<BottomTextInput
						className='h5 w-75 text-center'
						id={`char${props.characteristic.id}`}
						name={`char${props.characteristic.name.substring(0, 3).toUpperCase()}`}
						value={value}
						onChange={onChange}
						onBlur={onValueBlur}
						maxLength={3}
					/>
				</Col>
			</Row>
		</Col>
	);
}
