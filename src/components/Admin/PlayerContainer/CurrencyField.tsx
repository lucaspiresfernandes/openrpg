import { Currency } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { RetrieveSocket } from '../../../contexts';

type CurrencyFieldProps = {
    playerID: number;
    currency: {
        value: string;
        Currency: Currency;
    }[];
}

export default function CurrencyField({ playerID, currency: _currency }: CurrencyFieldProps) {
    const [currency, setCurrency] = useState(_currency);
    const socket = useContext(RetrieveSocket);

    useEffect(() => {
        if (!socket) return;

        socket.on('currencyChange', (pId, currencyID, value) => {
            if (pId !== playerID) return;

            const index = currency.findIndex(i => i.Currency.id === currencyID);

            if (index < 0) return;

            const newCurrency = [...currency];
            newCurrency[index].value = value;
            setCurrency(newCurrency);
        });

        return () => {
            socket.off('currencyChange');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <Row>
            {currency.map(curr =>
                <Col key={curr.Currency.id}>
                    <Row><Col className='h5'>{curr.value || '0'}</Col></Row>
                    <Row><Col>{curr.Currency.name}</Col></Row>
                </Col>
            )}
        </Row>
    );
}