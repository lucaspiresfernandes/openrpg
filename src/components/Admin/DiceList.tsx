import { useContext, useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { Socket } from '../../contexts';
import DataContainer from '../DataContainer';

const highlightStyle = { color: '#00a000', fontWeight: 'bold' };

export default function DiceList(props: { players: { id: number; name: string }[] }) {
	const [values, setValues] = useState<
		{ name: string; dices: string; results: string }[]
	>([]);
	const wrapper = useRef<HTMLDivElement | null>(null);
	const socket = useContext(Socket);

	useEffect(() => {
		if (wrapper.current) wrapper.current.scrollTo({ top: 0, behavior: 'auto' });
	}, [values]);

	useEffect(() => {
		if (!socket) return;

		socket.on('diceResult', (playerID, _results, _dices) => {
			const playerName =
				props.players.find((p) => p.id === playerID)?.name || 'Desconhecido';

			const dices = _dices.map((dice) => {
				const num = dice.num;
				const roll = dice.roll;
				return num > 0 ? `${num}d${roll}` : roll;
			});

			const results = _results.map((res) => {
				const roll = res.roll;
				const description = res.resultType?.description;
				if (description) return `${roll} (${description})`;
				return roll;
			});

			const message = {
				name: playerName,
				dices: dices.join(', '),
				results: results.join(', '),
			};

			setValues((values) => {
				if (values.length > 10) {
					const newValues = [...values];
					newValues.unshift(message);
					newValues.splice(newValues.length - 1, 1);
					return newValues;
				}
				return [message, ...values];
			});
		});

		return () => {
			socket.off('diceResult');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	return (
		<DataContainer xs={12} lg title='Histórico'>
			<Row>
				<Col>
					<div className='w-100 wrapper' ref={wrapper}>
						<ListGroup variant='flush' className='text-center'>
							{values.map((val, index) => (
								<ListGroup.Item key={index}>
									<span style={highlightStyle}>{val.name} </span>
									rolou
									<span style={highlightStyle}> {val.dices} </span>e tirou
									<span style={highlightStyle}> {val.results}</span>.
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				</Col>
			</Row>
		</DataContainer>
	);
}
