import type { ChangeEvent, MouseEventHandler } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DropdownItem from 'react-bootstrap/DropdownItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import PlayerPortraitButton from './PlayerPortraitButton';

const style = { maxWidth: '5rem' };

type NPCContainerProps = {
	basicNpcs: { id: number; name: string }[];
	complexNpcs: { id: number; name: string }[];
	onChangeBasicNpc: (ev: ChangeEvent<HTMLInputElement>, id: number) => void;
	onAddBasicNpc: MouseEventHandler;
	onRemoveBasicNpc: (id: number) => void;
	onAddComplexNpc: MouseEventHandler;
	onRemoveComplexNpc: (id: number) => void;
};

export default function NPCContainer(props: NPCContainerProps) {
	return (
		<DataContainer
			xs={12}
			lg
			title='NPCs'
			className='mb-3 mb-lg-0'
			addButton={{
				type: 'dropdown',
				children: (
					<>
						<DropdownItem onClick={props.onAddBasicNpc}>Básico</DropdownItem>
						<DropdownItem onClick={props.onAddComplexNpc}>Complexo</DropdownItem>
					</>
				),
			}}>
			<Row>
				<Col>
					<div className='w-100 wrapper'>
						<ListGroup variant='flush' className='text-center'>
							{props.basicNpcs.map(({ id, name }) => (
								<ListGroup.Item key={id}>
									<BottomTextInput
										value={name}
										onChange={(ev) => props.onChangeBasicNpc(ev, id)}
										className='w-25 mx-1'
									/>
									<BottomTextInput defaultValue='0/0' style={style} />
									<Button
										size='sm'
										variant='secondary'
										className='ms-1'
										onClick={() => props.onRemoveBasicNpc(id)}>
										-
									</Button>
								</ListGroup.Item>
							))}
							{props.complexNpcs.map(({ id, name }) => (
								<ListGroup.Item key={id}>
									<PlayerPortraitButton playerId={id} />
									<Button
										href={`/sheet/npc/${id}/1`}
										target='_blank'
										size='sm'
										variant='secondary'
										className='mx-2'>
										Acessar
									</Button>
									{name}
									<Button
										size='sm'
										variant='secondary'
										className='ms-2'
										onClick={() => props.onRemoveComplexNpc?.(id)}>
										-
									</Button>
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				</Col>
			</Row>
		</DataContainer>
	);
}
