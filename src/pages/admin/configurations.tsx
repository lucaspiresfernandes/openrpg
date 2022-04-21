import { Attribute } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownItem from 'react-bootstrap/DropdownItem';
import FormCheck from 'react-bootstrap/FormCheck';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ApplicationHead from '../../components/ApplicationHead';
import BottomTextInput from '../../components/BottomTextInput';
import DataContainer from '../../components/DataContainer';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import useToast from '../../hooks/useToast';
import { InferSSRProps } from '../../utils';
import api from '../../utils/api';
import {
	ContainerConfig,
	DiceConfig,
	PortraitConfig,
	PortraitOrientation,
} from '../../utils/config';
import prisma from '../../utils/database';
import { sessionSSR } from '../../utils/session';
import { containerConfigInsertData } from '../api/init';

export default function Configurations(
	props: InferSSRProps<typeof getSSP>
) {
	const [toasts, addToast] = useToast();
	const [index, setIndex] = useState(0);

	return (
		<>
			<ApplicationHead title='Configurações' />
			<AdminNavbar />
			<Container>
				<Row>
					<Col xs={2} className='me-5'>
						<ListGroup>
							<ListGroup.Item action active={index === 0} onClick={() => setIndex(0)}>
								Geral
							</ListGroup.Item>
							<ListGroup.Item action active={index === 1} onClick={() => setIndex(1)}>
								Dado
							</ListGroup.Item>
							<ListGroup.Item action active={index === 2} onClick={() => setIndex(2)}>
								Retrato
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col className='ps-5 border-start border-secondary'>
						<Row className='display-5 text-center mb-4'>
							<Col>Configurações do Sistema</Col>
						</Row>
						{index === 0 && (
							<GeneralEditor
								containerConfig={props.containerConfig}
								adminKey={props.adminKey}
								enableAutomaticMarking={props.automaticMarking}
								logError={addToast}
							/>
						)}
						{index === 1 && (
							<DiceEditor
								successTypeEnabled={props.enableSuccessTypes}
								diceConfig={props.dice}
								logError={addToast}
							/>
						)}
						{index === 2 && (
							<PortraitEditor
								portrait={props.portrait}
								attributes={props.attributes}
								logError={addToast}
							/>
						)}
					</Col>
				</Row>
			</Container>
			<ErrorToastContainer toasts={toasts} />
		</>
	);
}

function DiceEditor(props: {
	successTypeEnabled: boolean;
	diceConfig: DiceConfig;
	logError(err: any): void;
}) {
	const [loading, setLoading] = useState(false);
	const [successTypeEnabled, setSuccessTypeEnabled] = useState(props.successTypeEnabled);
	const [characteristicDiceNum, setCharacteristicDiceNum] = useState(
		props.diceConfig.characteristic?.value || props.diceConfig.base?.value
	);
	const [characteristicDiceBranched, setCharacteristicDiceBranched] = useState(
		props.diceConfig.characteristic?.branched || props.diceConfig.base?.branched
	);
	const [skillDiceNum, setSkillDiceNum] = useState(
		props.diceConfig.skill?.value || props.diceConfig.base?.value
	);
	const [skillDiceBranched, setSkillDiceBranched] = useState(
		props.diceConfig.skill?.branched || props.diceConfig.base?.branched
	);
	const [attributeDiceNum, setAttributeDiceNum] = useState(
		props.diceConfig.attribute.value
	);
	const [attributeDiceBranched, setAttributeDiceBranched] = useState(
		props.diceConfig.attribute.branched
	);

	function onApply() {
		setLoading(true);
		Promise.all([
			api.post('/config', { name: 'enable_success_types', value: successTypeEnabled }),
			api.post('/config', {
				name: 'dice',
				value: {
					characteristic: {
						value: characteristicDiceNum,
						branched: characteristicDiceBranched,
					},
					skill: {
						value: skillDiceNum,
						branched: skillDiceBranched,
					},
					attribute: {
						value: attributeDiceNum,
						branched: attributeDiceBranched,
					},
				},
			}),
		])
			.then(() => alert('Configurações de dado aplicadas com sucesso.'))
			.catch(props.logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<Row className='text-center'>
				<Col className='h5'>
					<FormCheck
						inline
						checked={successTypeEnabled}
						onChange={() => setSuccessTypeEnabled((e) => !e)}
						id='diceSuccessTypeEnabled'
						label='Ativar Tipos de Sucesso'
					/>
				</Col>
			</Row>
			<Row className='text-center'>
				<DataContainer
					title='Rolagem de Atributo'
					outline
					className='mx-3'
					hidden={!successTypeEnabled}>
					<Row>
						<Col className='h5' style={{ color: 'gray' }}>
							Rolagem de atributo é o tipo de rolagem aplicado a barras de Atributo
							roláveis.
						</Col>
					</Row>
					<Row>
						<Col>
							<label className='me-2' htmlFor='attributeDiceValue'>
								Valor:
							</label>
							<select
								id='attributeDiceValue'
								className='theme-element'
								value={attributeDiceNum}
								onChange={(ev) => setAttributeDiceNum(parseInt(ev.currentTarget.value))}>
								<option value={20}>d20</option>
								<option value={100}>d100</option>
							</select>
						</Col>
					</Row>
					<Row className='mt-2'>
						<Col>
							<FormCheck
								inline
								checked={attributeDiceBranched}
								onChange={() => setAttributeDiceBranched((b) => !b)}
								id='attributeDiceBranched'
								label='Ativar Ramificações'
							/>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<Row className='text-center'>
				<DataContainer
					title='Rolagem de Característica'
					outline
					className='mx-3'
					hidden={!successTypeEnabled}>
					<Row>
						<Col className='h5' style={{ color: 'gray' }}>
							Rolagem de Característica é o tipo de rolagem aplicado a Características.
						</Col>
					</Row>
					<Row>
						<Col>
							<label htmlFor='characteristicDiceValue' className='me-2'>
								Valor:
							</label>
							<select
								id='characteristicDiceValue'
								className='theme-element'
								value={characteristicDiceNum}
								onChange={(ev) =>
									setCharacteristicDiceNum(parseInt(ev.currentTarget.value))
								}>
								<option value={20}>d20</option>
								<option value={100}>d100</option>
							</select>
						</Col>
					</Row>
					<Row className='mt-2'>
						<Col>
							<FormCheck
								inline
								checked={characteristicDiceBranched}
								onChange={() => setCharacteristicDiceBranched((b) => !b)}
								id='characteristicDiceBranched'
								label='Ativar Ramificações'
							/>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<Row className='text-center mb-1'>
				<DataContainer
					title='Rolagem de Perícia'
					outline
					className='mx-3'
					hidden={!successTypeEnabled}>
					<Row>
						<Col className='h5' style={{ color: 'gray' }}>
							Rolagem de Perícia é o tipo de rolagem aplicado a Perícias.
						</Col>
					</Row>
					<Row>
						<Col>
							<label htmlFor='skillDiceValue' className='me-2'>
								Valor:
							</label>
							<select
								id='skillDiceValue'
								className='theme-element'
								value={skillDiceNum}
								onChange={(ev) => setSkillDiceNum(parseInt(ev.currentTarget.value))}>
								<option value={20}>d20</option>
								<option value={100}>d100</option>
							</select>
						</Col>
					</Row>
					<Row className='mt-2'>
						<Col>
							<FormCheck
								inline
								checked={skillDiceBranched}
								onChange={() => setSkillDiceBranched((b) => !b)}
								id='skillDiceBranched'
								label='Ativar Ramificações'
							/>
						</Col>
					</Row>
				</DataContainer>
			</Row>
			<Row className='mb-3'>
				<Col className='text-center'>
					<Button size='sm' variant='secondary' onClick={onApply} disabled={loading}>
						Aplicar
					</Button>
				</Col>
			</Row>
		</>
	);
}

function GeneralEditor(props: {
	containerConfig: ContainerConfig;
	adminKey: string;
	enableAutomaticMarking: boolean;
	logError(err: any): void;
}) {
	const [names, setNames] = useState(props.containerConfig);
	const [loading, setLoading] = useState(false);
	const [adminKey, setAdminKey] = useState(props.adminKey);
	const [automaticMarking, setAutomaticMarking] = useState(props.enableAutomaticMarking);

	function onNameChange(ev: ChangeEvent<HTMLInputElement>, originalName: string) {
		const newNames = [...names];
		const index = newNames.findIndex((n) => n.originalName === originalName);
		newNames[index].name = ev.currentTarget.value;
		setNames(newNames);
	}

	function onApply() {
		setLoading(true);
		Promise.all([
			api.post('/config', { name: 'container', value: names }),
			api.post('/config', { name: 'enable_automatic_markers', value: automaticMarking }),
			api.post('/config', { name: 'admin_key', value: adminKey }),
		])
			.then(() => alert('Configurações gerais aplicadas com sucesso.'))
			.catch(props.logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<Row className='mb-3'>
				<Col className='h5'>
					<label htmlFor='adminKeyField' className='me-2'>
						Chave do Mestre:
					</label>
					<BottomTextInput
						id='adminKeyField'
						value={adminKey}
						onChange={(ev) => setAdminKey(ev.currentTarget.value)}
					/>
				</Col>
			</Row>
			<Row className='mb-3'>
				<Col className='h5'>
					<FormCheck
						checked={automaticMarking}
						onChange={(ev) => setAutomaticMarking(ev.target.checked)}
						label='Ativar Marcação Automática de Perícia?'
						title='Marca a Perícia automaticamente ao tirar um Sucesso ou maior no teste.'
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					{names.map((container) => (
						<Row key={container.originalName}>
							<Col className='h5'>
								<label htmlFor={`containerField${container.originalName}`}>
									Nome do contêiner de {container.originalName}:
								</label>
								<BottomTextInput
									id={`containerField${container.originalName}`}
									className='ms-2'
									value={container.name}
									onChange={(ev) => onNameChange(ev, container.originalName)}
								/>
							</Col>
						</Row>
					))}
					<Row className='my-2 text-center'>
						<Col>
							<Button size='sm' variant='secondary' onClick={onApply} disabled={loading}>
								Aplicar
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
}

type PortraitContainerProps = {
	portrait: {
		attributes: Attribute[];
		side_attribute: Attribute | null;
		orientation: PortraitOrientation;
	};
	attributes: Attribute[];
	logError(err: any): void;
};

function PortraitEditor(props: PortraitContainerProps) {
	const [loading, setLoading] = useState(false);
	const [attributes, setAttributes] = useState<Attribute[]>(props.portrait.attributes);
	const [sideAttribute, setSideAttribute] = useState(props.portrait.side_attribute);
	const [orientation, setOrientation] = useState<string>(props.portrait.orientation);
	const availableAttributes = props.attributes.filter(
		(attr) => !attributes.find((at) => at.id === attr.id) && attr.id !== sideAttribute?.id
	);

	function onApply() {
		setLoading(true);
		api
			.post('/config', {
				name: 'portrait',
				value: {
					attributes: attributes.map((attr) => attr.id),
					side_attribute: sideAttribute?.id || 0,
					orientation,
				},
			})
			.then(() => alert('Configurações de retrato aplicadas com sucesso.'))
			.catch(props.logError)
			.finally(() => setLoading(false));
	}

	function addAttribute(attr: Attribute) {
		setAttributes([...attributes, attr]);
	}

	function removeAttribute(id: number) {
		const newAttr = [...attributes];
		newAttr.splice(
			attributes.findIndex((attr) => attr.id === id),
			1
		);
		setAttributes(newAttr);
	}

	function onSideAttributeChange(ev: ChangeEvent<HTMLSelectElement>) {
		const id = parseInt(ev.currentTarget.value);
		setSideAttribute(availableAttributes.find((attr) => attr.id === id) || null);
	}

	return (
		<>
			<Row className='text-center'>
				<Col className='h5'>
					<label htmlFor='portraitOrientation' className='me-2'>
						Orientação do Retrato:
					</label>
					<select
						id='portraitOrientation'
						className='theme-element'
						value={orientation}
						onChange={(ev) => setOrientation(ev.currentTarget.value)}>
						<option value='center'>Centro</option>
						<option value='top'>Superior</option>
						<option value='bottom'>Inferior</option>
					</select>
				</Col>
			</Row>
			<hr />
			<Row className='mt-2 justify-content-center align-items-center'>
				<Col xs='auto' className='h5' style={{ margin: 0 }}>
					Atributos Primários
				</Col>
				<Col xs={1}>
					<DropdownButton
						title='+'
						variant='secondary'
						size='sm'
						menuVariant='dark'
						disabled={loading || availableAttributes.length === 0}>
						{availableAttributes.map((attr) => (
							<DropdownItem key={attr.id} onClick={() => addAttribute(attr)}>
								{attr.name}
							</DropdownItem>
						))}
					</DropdownButton>
				</Col>
			</Row>
			<Row className='text-center justify-content-center'>
				<Col xs={8}>
					<ListGroup variant='flush' className='rounded my-3'>
						{attributes.map((attr) => (
							<ListGroup.Item key={attr.id}>
								{attr.name}
								<Button
									size='sm'
									variant='secondary'
									className='ms-2'
									onClick={() => removeAttribute(attr.id)}>
									-
								</Button>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Col>
			</Row>
			<hr />
			<Row className='my-2 text-center justify-content-center'>
				<Col className='h5'>
					<label htmlFor='portraitSideAttribute' className='me-2'>
						Atributo Secundário:
					</label>
					<select
						id='portraitSideAttribute'
						className='theme-element'
						value={sideAttribute?.id || 0}
						onChange={onSideAttributeChange}>
						<option value={0} key={0}>
							Nenhum
						</option>
						{props.attributes.map((attr) => {
							if (attributes.find((at) => at.id === attr.id)) return null;
							return (
								<option value={attr.id} key={attr.id}>
									{attr.name}
								</option>
							);
						})}
					</select>
				</Col>
			</Row>
			<Row className='mt-5 mb-3 text-center'>
				<Col>
					<Button size='sm' variant='secondary' onClick={onApply} disabled={loading}>
						Aplicar
					</Button>
				</Col>
			</Row>
		</>
	);
}

async function getSSP(ctx: GetServerSidePropsContext) {
	const player = ctx.req.session.player;

	if (!player || !player.admin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			}
		};
	}

	const portraitConfig = JSON.parse(
		(
			await prisma.config.findUnique({
				where: { name: 'portrait' },
				select: { value: true },
			})
		)?.value || 'null'
	) as PortraitConfig;

	const results = await prisma.$transaction([
		prisma.config.findUnique({ where: { name: 'admin_key' }, select: { value: true } }),
		prisma.config.findUnique({
			where: { name: 'enable_success_types' },
			select: { value: true },
		}),
		prisma.config.findUnique({ where: { name: 'dice' }, select: { value: true } }),
		prisma.attribute.findMany({ where: { id: { in: portraitConfig.attributes } } }),
		prisma.attribute.findUnique({ where: { id: portraitConfig.side_attribute } }),
		prisma.attribute.findMany(),
		prisma.config.findUnique({ where: { name: 'container' }, select: { value: true } }),
		prisma.config.findUnique({
			where: { name: 'enable_automatic_markers' },
			select: { value: true },
		}),
	]);

	const containerConfigQuery =
		results[6] || (await prisma.config.create({ data: containerConfigInsertData }));

	return {
		props: {
			adminKey: results[0]?.value || '',
			enableSuccessTypes: results[1]?.value === 'true',
			dice: JSON.parse(results[2]?.value || 'null') as DiceConfig,
			portrait: {
				attributes: results[3],
				side_attribute: results[4],
				orientation: portraitConfig.orientation || 'bottom',
			},
			attributes: results[5],
			containerConfig: JSON.parse(
				containerConfigQuery.value || 'null'
			) as ContainerConfig,
			automaticMarking: results[7]?.value === 'true' ? true : false,
		},
	};
}

export const getServerSideProps = sessionSSR(getSSP);
