import type { Characteristic } from '@prisma/client';
import { useContext } from 'react';
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
import DiceRollModal from '../Modals/DiceRollModal';

type PlayerCharacteristicContainerProps = {
	playerCharacteristics: {
		value: number;
		Characteristic: Characteristic;
		modifier: number | null;
	}[];
	characteristicDiceConfig: DiceConfigCell;
	npcId?: number;
};

export default function PlayerCharacteristicContainer(
	props: PlayerCharacteristicContainerProps
) {
	const [diceRollModalProps, onDiceRoll] = useDiceRoll(props.npcId);
	return (
		<>
			<Row className='text-center align-items-end justify-content-center'>
				{props.playerCharacteristics.map((char) => (
					<PlayerCharacteristicField
						key={char.Characteristic.id}
						modifier={char.modifier}
						characteristic={char.Characteristic}
						value={char.value}
						characteristicDiceConfig={props.characteristicDiceConfig}
						showDiceRollResult={onDiceRoll}
						npcId={props.npcId}
					/>
				))}
			</Row>
			<DiceRollModal {...diceRollModalProps} />
		</>
	);
}

type PlayerCharacteristicFieldProps = {
	characteristicDiceConfig: DiceConfigCell;
	value: number;
	modifier: number | null;
	characteristic: Characteristic;
	showDiceRollResult: DiceRollEvent;
	npcId?: number;
};

function PlayerCharacteristicField(props: PlayerCharacteristicFieldProps) {
	const [value, setValue, isValueClean] = useExtendedState(props.value.toString());
	const [modifier, setModifier, isModifierClean] = useExtendedState(() => {
		const modifier = props.modifier;
		if (modifier === null) return null;

		let mod = modifier.toString();
		if (modifier > -1) mod = `+${mod}`;
		return mod;
	});
	const logError = useContext(ErrorLogger);

	const charID = props.characteristic.id;

	function onValueBlur() {
		const aux = value;
		let newValue = parseInt(aux);
		if (aux.length === 0 || isNaN(newValue)) {
			newValue = 0;
			setValue(newValue.toString());
		}

		if (isValueClean()) return;

		api
			.post('/sheet/player/characteristic', {
				value: newValue,
				id: charID,
				npcId: props.npcId,
			})
			.catch(logError);
	}

	function onModifierBlur() {
		if (!modifier) return;

		const num = parseInt(modifier);

		let newModifier = modifier;
		if (isNaN(num)) newModifier = '+0';
		else if (newModifier === '-0') newModifier = '+0';
		else if (num > 0) newModifier = `+${num}`;

		if (modifier !== newModifier) setModifier(newModifier);

		if (isModifierClean()) return;

		api
			.post('/sheet/player/characteristic', {
				modifier: parseInt(newModifier),
				id: charID,
				npcId: props.npcId,
			})
			.catch(logError);
	}

	function rollDice(standalone: boolean) {
		const roll = props.characteristicDiceConfig.value;
		const branched = props.characteristicDiceConfig.branched;

		let mod: number | null = null;
		if (modifier) mod = parseInt(modifier);

		const val = parseInt(value);

		props.showDiceRollResult({
			dices: {
				num: standalone ? 1 : undefined,
				roll,
				ref: mod === null ? val : Math.max(1, val + mod),
			},
			resolverKey: `${roll}${branched ? 'b' : ''}`,
			onResult: (results) => {
				const _mod = mod;
				if (_mod === null) return;
				return results.map((res) => ({
					roll: Math.max(1, res.roll + _mod),
					resultType: res.resultType,
				}));
			},
		});
	}

	return (
		<Col xs={6} md={4} xl={3} className='my-2'>
			<Row>
				<Col className='mb-2'>
					<Image
						fluid
						alt='Dado'
						className='clickable'
						src='/dice20.webp'
						onClick={(ev) => rollDice(ev.ctrlKey)}
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
			{modifier !== null && (
				<Row className='justify-content-center mb-2'>
					<Col xs={3}>
						<BottomTextInput
							aria-label={`Modificador de ${props.characteristic.name}`}
							className='text-center w-100'
							value={modifier}
							onChange={(ev) => setModifier(ev.currentTarget.value)}
							onBlur={onModifierBlur}
						/>
					</Col>
				</Row>
			)}
			<Row>
				<Col>
					<BottomTextInput
						autoComplete='off'
						className='h5 w-75 text-center'
						id={`char${props.characteristic.id}`}
						name={`char${props.characteristic.name.substring(0, 3).toUpperCase()}`}
						value={value}
						onChange={(ev) => setValue(ev.currentTarget.value)}
						onBlur={onValueBlur}
						maxLength={3}
					/>
				</Col>
			</Row>
		</Col>
	);
}
