import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import SheetModal from './SheetModal';

export type TradeType = 'equipment' | 'item';

const tradeTypes = new Map<TradeType, string>([
	['equipment', 'Equipamento'],
	['item', 'Item'],
]);

export type Trade<T> = {
	type: TradeType;
	show: boolean;
	offer: T;
	donation: boolean;
};

type PlayerTradeModalProps<T> = Trade<T> & {
	partners: {
		id: number;
		name: string;
	}[];
	onSubmit: (partnerId: number, tradeId?: number) => void;
	onHide: () => void;
	disabled?: boolean;
};

export default function PlayerTradeModal<T extends { id: number; name: string }>(
	props: PlayerTradeModalProps<T>
) {
	const [loading, setLoading] = useState(false);

	const [partnerId, setPartnerId] = useState(0);
	const [tradeId, setTradeId] = useState<number | undefined>();
	const [trades, setTrades] = useState<T[] | undefined>();

	const logError = useContext(ErrorLogger);

	function onEnter() {
		setPartnerId(props.partners[0]?.id || 0);
	}

	function onExited() {
		setPartnerId(0);
		setTradeId(0);
		setTrades(undefined);
	}

	useEffect(() => {
		if (props.donation) return;

		let link: string;
		let objNames: string;
		switch (props.type) {
			case 'equipment':
				link = '/sheet/player/equipment';
				objNames = 'equipments';
				break;
			case 'item':
				link = '/sheet/player/item';
				objNames = 'items';
				break;
			default:
				link = '/sheet/player/equipment';
				objNames = 'equipments';
				break;
		}

		setLoading(true);

		api
			.get(link, {
				params: {
					playerId: partnerId,
				},
			})
			.then((res) => {
				const objects: T[] = res.data[objNames];

				const index = objects.findIndex(o => o.id === props.offer.id);
				if (index > -1) {
					objects.splice(index, 1);
				}

				setTradeId(objects[0]?.id);
				setTrades(objects);
			})
			.catch(logError)
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [partnerId]);

	return (
		<SheetModal
			title={`${trades ? 'Trocar' : 'Oferecer'} ${tradeTypes.get(props.type)}`}
			show={props.show}
			onHide={props.onHide}
			onEnter={onEnter}
			onExited={onExited}
			applyButton={{
				name: trades ? 'Trocar' : 'Oferecer',
				onApply: () => props.onSubmit(partnerId, tradeId),
				disabled: loading || props.partners.length === 0 || props.disabled,
			}}>
			<Container fluid>
				<div className='mb-3 h5 text-center'>
					{trades ? 'Trocando' : 'Oferecendo'}: {props.offer.name}
				</div>
				<FormGroup controlId='playerInteractionName' className='mb-3'>
					<FormLabel>Nome do Player</FormLabel>
					<FormSelect
						className='theme-element'
						value={partnerId}
						onChange={(ev) => setPartnerId(parseInt(ev.currentTarget.value))}
						disabled={props.partners.length === 0}>
						{props.partners.map((part) => (
							<option key={part.id} value={part.id}>
								{part.name || 'Desconhecido'}
							</option>
						))}
					</FormSelect>
				</FormGroup>
				{trades?.length === 0 ? (
					<>O jogador selecionado não possui nenhum item para trocar.</>
				) : (
					trades && (
						<FormGroup controlId='playerInteractionTrade'>
							<FormLabel>Troca</FormLabel>
							<FormSelect
								className='theme-element'
								value={tradeId}
								onChange={(ev) => setTradeId(parseInt(ev.currentTarget.value))}>
								{trades.map((trad) => (
									<option key={trad.id} value={trad.id}>
										{trad.name}
									</option>
								))}
							</FormSelect>
						</FormGroup>
					)
				)}
			</Container>
		</SheetModal>
	);
}
