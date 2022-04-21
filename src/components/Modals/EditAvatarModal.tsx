import { ChangeEvent, useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import SheetModal from './SheetModal';

type AvatarData = {
	id: number | null;
	link: string | null;
	name: string;
};

type EditAvatarModalProps = {
	playerAvatars: {
		link: string | null;
		AttributeStatus: {
			id: number;
			name: string;
		} | null;
	}[];
	show?: boolean;
	onHide?(): void;
	onUpdate?(): void;
};

export default function EditAvatarModal(props: EditAvatarModalProps) {
	const logError = useContext(ErrorLogger);
	const [avatars, setAvatars] = useState<AvatarData[]>(
		props.playerAvatars.map((avatar) => {
			return {
				id: avatar.AttributeStatus?.id || null,
				name: avatar.AttributeStatus?.name || 'Padrão',
				link: avatar.link,
			};
		})
	);

	function onUpdateAvatar() {
		api
			.post('/sheet/player/avatar', { avatarData: avatars })
			.then(props.onUpdate)
			.catch(logError);
	}

	function onAvatarChange(id: number | null, ev: ChangeEvent<HTMLInputElement>) {
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
			applyButton={{ name: 'Atualizar', onApply: onUpdateAvatar }}
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
					<FormGroup className='mb-3' key={avatar.id || null}>
						<FormLabel>Avatar ({avatar.name || 'Padrão'})</FormLabel>
						<FormControl
							className='theme-element'
							value={avatar.link || ''}
							onChange={(ev) =>
								onAvatarChange(avatar.id || null, ev as ChangeEvent<HTMLInputElement>)
							}
						/>
					</FormGroup>
				))}
			</Container>
		</SheetModal>
	);
}
