import { Info, Spec } from '@prisma/client';
import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

type PlayerInfoContainerProps = {
	title: string;
	playerName: string;
	playerNameShow: boolean;
	playerInfo: {
		Info: Info;
		value: string;
	}[];
	playerSpec: {
		Spec: Spec;
		value: string;
	}[];
};

export default function PlayerInfoContainer(props: PlayerInfoContainerProps) {
	return (
		<DataContainer outline title={props.title}>
			<PlayerNameField value={props.playerName} show={props.playerNameShow} />
			{props.playerInfo.map((info) => (
				<Row className='mb-4' key={info.Info.id}>
					<Col>
						<div>
							<label className='h5' htmlFor={`info${info.Info.id}`} style={{ margin: 0 }}>
								{info.Info.name}
							</label>
						</div>
						<PlayerInfoField infoId={info.Info.id} value={info.value} />
					</Col>
				</Row>
			))}
			<hr />
			<Row className='justify-content-center'>
				{props.playerSpec.map((spec) => (
					<Col key={spec.Spec.id} xs={12} sm={6} lg={4} className='text-center mb-2'>
						<PlayerSpecField
							value={spec.value}
							specId={spec.Spec.id}
							name={spec.Spec.name}
						/>
						<label htmlFor={`spec${spec.Spec.id}`}>{spec.Spec.name}</label>
					</Col>
				))}
			</Row>
		</DataContainer>
	);
}

type PlayerNameFieldProps = {
	show: boolean;
	value: string;
};

function PlayerNameField(props: PlayerNameFieldProps) {
	const [show, setShow] = useState(props.show);
	const [value, setValue, isClean] = useExtendedState(props.value);
	const [isDefined, setDefined] = useState(props.value.length > 0);
	const inputRef = useRef<HTMLInputElement>(null);
	const componentDidMount = useRef(false);

	const logError = useContext(ErrorLogger);

	useEffect(() => {
		if (componentDidMount.current) {
			if (!isDefined && inputRef.current) inputRef.current.focus();
			return;
		}
		componentDidMount.current = true;
	}, [isDefined]);

	function onShowChange(ev: MouseEvent<HTMLButtonElement>) {
		ev.currentTarget.blur();
		setShow((s) => {
			const newShow = !s;
			api
				.post('/sheet/player', {
					showName: newShow,
				})
				.catch(logError);
			return newShow;
		});
	}

	function onValueBlur() {
		if (value.length > 0) setDefined(true);
		if (isClean()) return;
		api.post('/sheet/player', { name: value }).catch(logError);
	}

	return (
		<Row className='mb-4'>
			<Col>
				<Row>
					<Col>
						<label className='h5' htmlFor='playerName' style={{ margin: 0 }}>
							Nome
						</label>
					</Col>
				</Row>
				<Row>
					<Col xs='auto' style={{ paddingRight: 0 }}>
						<Button
							size='sm'
							variant={show ? 'primary' : 'secondary'}
							onClick={onShowChange}>
							{show ? <AiFillEye /> : <AiFillEyeInvisible />}
						</Button>
					</Col>
					<Col className='align-self-center'>
						{isDefined ? (
							<label onDoubleClick={() => setDefined(false)}>{value}</label>
						) : (
							<input
								className='theme-element bottom-text w-100'
								id='playerName'
								autoComplete='off'
								value={value}
								onChange={(ev) => setValue(ev.currentTarget.value)}
								onBlur={onValueBlur}
								ref={inputRef}
							/>
						)}
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

type PlayerInfoFieldProps = {
	infoId: number;
	value: string;
};

function PlayerInfoField(props: PlayerInfoFieldProps) {
	const [value, setValue, isClean] = useExtendedState(props.value);
	const [isDefined, setDefined] = useState(props.value.length > 0);
	const inputRef = useRef<HTMLInputElement>(null);
	const componentDidMount = useRef(false);

	const logError = useContext(ErrorLogger);

	useEffect(() => {
		if (componentDidMount.current) {
			if (!isDefined && inputRef.current) inputRef.current.focus();
			return;
		}
		componentDidMount.current = true;
	}, [isDefined]);

	function onValueBlur() {
		if (value.length > 0) setDefined(true);
		if (isClean()) return;
		api.post('/sheet/player/info', { id: props.infoId, value }).catch(logError);
	}

	if (isDefined) return <label onDoubleClick={() => setDefined(false)}>{value}</label>;

	return (
		<input
			className='theme-element bottom-text w-100'
			id={`info${props.infoId}`}
			autoComplete='off'
			value={value}
			onChange={(ev) => setValue(ev.currentTarget.value)}
			onBlur={onValueBlur}
			ref={inputRef}
		/>
	);
}

type PlayerSpecFieldProps = {
	value: string;
	name: string;
	specId: number;
};

function PlayerSpecField(playerSpec: PlayerSpecFieldProps) {
	const [value, setValue, isClean] = useExtendedState(playerSpec.value);

	const logError = useContext(ErrorLogger);
	const specID = playerSpec.specId;

	function onValueBlur() {
		if (isClean()) return;
		api.post('/sheet/player/spec', { id: specID, value }).catch(logError);
	}

	return (
		<BottomTextInput
			className='w-100 text-center h5'
			onBlur={onValueBlur}
			name={`spec${playerSpec.name}`}
			id={`spec${specID}`}
			autoComplete='off'
			value={value}
			onChange={(ev) => setValue(ev.currentTarget.value)}
		/>
	);
}
