import type { ChangeEvent } from 'react';
import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Row from 'react-bootstrap/Row';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import SheetModal from './SheetModal';

type AvatarData = {
	id: number | null;
	link: string | null;
	name: string;
};

type PlayerAvatarModalProps = {
	playerAvatars: {
		link: string | null;
		AttributeStatus: {
			id: number;
			name: string;
		} | null;
	}[];
	show?: boolean;
	onHide?: () => void;
	onUpdate?: () => void;
	npcId?: number;
};

export default function PlayerAvatarModal(props: PlayerAvatarModalProps) {
	const [avatars, setAvatars] = useState<AvatarData[]>(
		props.playerAvatars.map((avatar) => {
			if (avatar.AttributeStatus)
				return {
					id: avatar.AttributeStatus.id,
					name: avatar.AttributeStatus.name,
					link: avatar.link,
				};
			else
				return {
					id: null,
					name: 'Padrão',
					link: avatar.link,
				};
		})
	);
	const [loading, setLoading] = useState(false);
	const logError = useContext(ErrorLogger);

	function onUpdateAvatar() {
		setLoading(true);
		api
			.post('/sheet/player/avatar', { avatarData: avatars, npcId: props.npcId })
			.then(props.onUpdate)
			.catch(logError)
			.finally(() => {
				setLoading(false);
				props.onHide?.();
			});
	}

	function onAvatarChange(
		id: number | null,
		ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setAvatars((avatars) => {
			const newAvatars = [...avatars];
			const av = newAvatars.find((avatar) => avatar.id === id);
			if (av) av.link = ev.target.value || null;
			return newAvatars;
		});
	}

	return (
		<SheetModal
			title='Editar Avatar'
			applyButton={{ name: 'Atualizar', onApply: onUpdateAvatar, disabled: loading }}
			show={props.show}
			onHide={props.onHide}
			scrollable>
			<Container fluid>
				<Row className='mb-3 h4 text-center'>
					<Col>
						Caso vá usar a extensão do OBS, é recomendado que as imagens estejam no
						tamanho de <b>420x600</b> (ou no aspecto de 7:10) e em formato <b>PNG</b>.
					</Col>
				</Row>
				{avatars.map((avatar) => (
					<FormGroup
						className='mb-3'
						controlId={`editAvatar${avatar.id}`}
						key={avatar.id}>
						<FormLabel>Avatar ({avatar.name})</FormLabel>
						<FormControl
							className='theme-element'
							value={avatar.link || ''}
							onChange={(ev) => onAvatarChange(avatar.id, ev)}
							disabled={loading}
						/>
					</FormGroup>
				))}
			</Container>
		</SheetModal>
	);
}
