import { Attribute, AttributeStatus } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import useDiceRoll, { DiceRollEvent } from '../../hooks/useDiceRoll';
import { clamp } from '../../utils';
import api from '../../utils/api';
import { DiceConfigCell } from '../../utils/config';
import DiceRollResultModal from '../Modals/DiceRollResultModal';
import EditAvatarModal from '../Modals/EditAvatarModal';
import GeneralDiceRollModal from '../Modals/GeneralDiceRollModal';

const MAX_AVATAR_HEIGHT = 450;

type PlayerAttributeContainerProps = {
	playerAttributes: {
		value: number;
		maxValue: number;
		Attribute: Attribute;
	}[];
	playerAttributeStatus: {
		value: boolean;
		AttributeStatus: AttributeStatus;
	}[];
	playerAvatars: {
		link: string | null;
		AttributeStatus: {
			id: number;
			name: string;
		} | null;
	}[];
	attributeDiceConfig: DiceConfigCell;
};

export default function PlayerAttributeContainer(props: PlayerAttributeContainerProps) {
	const [diceRollResultModalProps, onDiceRoll] = useDiceRoll();
	const [playerAttributeStatus, setPlayerStatus] = useState(props.playerAttributeStatus);
	const [notify, setNotify] = useState(false);

	function onStatusChanged(id: number, newValue: boolean) {
		const newPlayerStatus = [...playerAttributeStatus];
		const index = newPlayerStatus.findIndex((stat) => stat.AttributeStatus.id === id);
		newPlayerStatus[index].value = newValue;
		setPlayerStatus(newPlayerStatus);
	}

	return (
		<>
			<Row className='mt-4 mb-2 justify-content-center'>
				<PlayerAvatarImage
					statusID={playerAttributeStatus.find((stat) => stat.value)?.AttributeStatus.id}
					rerender={notify}
					playerAvatars={props.playerAvatars}
					onAvatarUpdate={() => setNotify((n) => !n)}
				/>
				<PlayerAvatarDice showDiceRollResult={onDiceRoll} />
			</Row>
			{props.playerAttributes.map((attr) => {
				const status = playerAttributeStatus.filter(
					(stat) => stat.AttributeStatus.attribute_id === attr.Attribute.id
				);
				return (
					<PlayerAttributeField
						key={attr.Attribute.id}
						attributeDiceConfig={props.attributeDiceConfig}
						playerAttribute={attr}
						playerStatus={status}
						onStatusChanged={onStatusChanged}
						showDiceRollResult={onDiceRoll}
					/>
				);
			})}
			<DiceRollResultModal {...diceRollResultModalProps} />
		</>
	);
}

type PlayerAttributeFieldProps = {
	playerAttribute: {
		value: number;
		maxValue: number;
		Attribute: Attribute;
	};
	playerStatus: {
		value: boolean;
		AttributeStatus: {
			id: number;
			name: string;
			attribute_id: number;
		};
	}[];
	onStatusChanged?(id: number, newValue: boolean): void;
	attributeDiceConfig: DiceConfigCell;
	showDiceRollResult: DiceRollEvent;
};

function PlayerAttributeField(props: PlayerAttributeFieldProps) {
	const attributeID = props.playerAttribute.Attribute.id;
	const [value, setValue] = useState(props.playerAttribute.value);
	const [maxValue, setMaxValue] = useState(props.playerAttribute.maxValue);
	const barRef = useRef<HTMLDivElement>(null);
	const timeout = useRef<NodeJS.Timeout>();
	const logError = useContext(ErrorLogger);

	useEffect(() => {
		if (barRef.current === null) return;
		const inner = barRef.current.querySelector('.progress-bar') as HTMLDivElement;
		if (inner) inner.style.backgroundColor = `#${props.playerAttribute.Attribute.color}`;
		else
			console.warn(
				'Could not find .progress-bar inner node inside PlayerAttributeField component.'
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [barRef]);

	useEffect(() => {
		if (timeout.current) clearTimeout(timeout.current);
	}, [maxValue]);

	function updateValue(ev: React.MouseEvent, coeff: number) {
		if (ev.shiftKey) coeff *= 10;

		const newVal = clamp(value + coeff, 0, maxValue);

		if (value === newVal) return;

		setValue(newVal);

		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(
			() =>
				api
					.post('/sheet/player/attribute', { id: attributeID, value: newVal })
					.catch(logError),
			750
		);
	}

	function onNewMaxValue() {
		let input = prompt('Digite o novo valor do atributo:', maxValue.toString());

		if (input === null) return;

		const newMaxValue = parseInt(input);

		if (isNaN(newMaxValue) || maxValue === newMaxValue) return;

		setMaxValue(newMaxValue);
		let valueUpdated = false;
		if (value > newMaxValue) {
			setValue(newMaxValue);
			valueUpdated = true;
		}

		api
			.post('/sheet/player/attribute', {
				id: attributeID,
				maxValue: newMaxValue,
				value: valueUpdated ? newMaxValue : undefined,
			})
			.catch(logError);
	}

	function diceClick() {
		const roll = props.attributeDiceConfig.value;
		const branched = props.attributeDiceConfig.branched;
		props.showDiceRollResult(
			[{ num: 1, roll, ref: value }],
			`${roll}${branched ? 'b' : ''}`
		);
	}

	return (
		<>
			<Row>
				<Col>
					<label htmlFor={`attribute${attributeID}`}>
						Pontos de {props.playerAttribute.Attribute.name}
					</label>
				</Col>
			</Row>
			<Row>
				<Col>
					<ProgressBar
						now={value}
						min={0}
						max={maxValue}
						ref={barRef}
						className='clickable'
						onClick={onNewMaxValue}
					/>
				</Col>
				{props.playerAttribute.Attribute.rollable && (
					<Col xs='auto' className='align-self-center'>
						<Image
							src='/dice20.png'
							alt='Dado'
							className='attribute-dice clickable'
							onClick={diceClick}
						/>
					</Col>
				)}
			</Row>
			<Row className='justify-content-center mt-2'>
				<Col xs lg={3}>
					<Button
						variant='secondary'
						className='w-100'
						onClick={(ev) => updateValue(ev, -1)}>
						-
					</Button>
				</Col>
				<Col xs lg={2} className='text-center align-self-center h5 m-0'>
					{`${value}/${maxValue}`}
				</Col>
				<Col xs lg={3}>
					<Button
						variant='secondary'
						className='w-100'
						onClick={(ev) => updateValue(ev, 1)}>
						+
					</Button>
				</Col>
			</Row>
			<Row className='mt-2 mb-3'>
				<Col>
					{props.playerStatus.map((stat) => (
						<PlayerAttributeStatusField
							key={stat.AttributeStatus.id}
							playerAttributeStatus={stat}
							onStatusChanged={props.onStatusChanged}
						/>
					))}
				</Col>
			</Row>
		</>
	);
}

type PlayerAttributeStatusFieldProps = {
	playerAttributeStatus: {
		value: boolean;
		AttributeStatus: {
			id: number;
			name: string;
			attribute_id: number;
		};
	};
	onStatusChanged?(id: number, newValue: boolean): void;
};

function PlayerAttributeStatusField({
	playerAttributeStatus,
	onStatusChanged,
}: PlayerAttributeStatusFieldProps) {
	const id = playerAttributeStatus.AttributeStatus.id;
	const attrID = playerAttributeStatus.AttributeStatus.attribute_id;
	const name = playerAttributeStatus.AttributeStatus.name;
	const logError = useContext(ErrorLogger);
	const [checked, setChecked] = useState(playerAttributeStatus.value);

	function changeValue() {
		const value = !checked;
		setChecked(value);
		api
			.post('/sheet/player/attribute/status', { attrStatusID: id, value })
			.then(() => {
				if (onStatusChanged) onStatusChanged(id, value);
			})
			.catch((err) => {
				logError(err);
				setChecked(checked);
			});
	}

	return (
		<FormCheck
			inline
			checked={checked}
			onChange={changeValue}
			id={`spec${id}${attrID}`}
			label={name}
		/>
	);
}

type PlayerAvatarImageProps = {
	statusID?: number;
	rerender: boolean;
	onAvatarUpdate?(): void;
	playerAvatars: {
		link: string | null;
		AttributeStatus: {
			id: number;
			name: string;
		} | null;
	}[];
};

function PlayerAvatarImage(props: PlayerAvatarImageProps) {
	const statusID = props.statusID || 0;

	const [src, setSrc] = useState('#');
	const [avatarModalShow, setAvatarModalShow] = useState(false);
	const previousStatusID = useRef(statusID);

	useEffect(() => {
		api
			.get(`/sheet/player/avatar/${statusID}`)
			.then((res) => setSrc(res.data.link))
			.catch(() => setSrc('/avatar404.png'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.rerender]);

	useEffect(() => {
		if (statusID === previousStatusID.current) return;
		previousStatusID.current = statusID;
		api
			.get(`/sheet/player/avatar/${statusID}`)
			.then((res) => setSrc(res.data.link))
			.catch(() => setSrc('/avatar404.png'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.statusID]);

	return (
		<>
			<Col xl={{ offset: 2 }} className='text-center'>
				<Image
					fluid
					src={src}
					alt='Avatar'
					className='clickable'
					style={{ maxHeight: MAX_AVATAR_HEIGHT }}
					onError={() => setSrc('/avatar404.png')}
					onClick={() => setAvatarModalShow(true)}
				/>
			</Col>
			<EditAvatarModal
				playerAvatars={props.playerAvatars}
				show={avatarModalShow}
				onHide={() => setAvatarModalShow(false)}
				onUpdate={props.onAvatarUpdate}
			/>
		</>
	);
}

function PlayerAvatarDice({ showDiceRollResult }: { showDiceRollResult: DiceRollEvent }) {
	const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);

	return (
		<>
			<Col xs={4} md={3} xl={2} className='align-self-center'>
				<Image
					fluid
					src='/dice20.png'
					alt='Dado Geral'
					className='clickable'
					onClick={() => setGeneralDiceRollShow(true)}
				/>
			</Col>
			<GeneralDiceRollModal
				show={generalDiceRollShow}
				onHide={() => setGeneralDiceRollShow(false)}
				showDiceRollResult={showDiceRollResult}
			/>
		</>
	);
}
