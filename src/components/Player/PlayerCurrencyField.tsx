import { Currency, PlayerCurrency } from '@prisma/client';
import { useContext } from 'react';
import { Col, Form } from 'react-bootstrap';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerCurrencyFieldProps = {
    currency: PlayerCurrency & { Currency: Currency };
}

export default function PlayerCurrencyField({ currency }: PlayerCurrencyFieldProps) {
    const logError = useContext(ErrorLogger);
    const [lastValue, value, setValue] = useExtendedState(currency.value);

    function onBlur() {
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/currency', { id: currency.currency_id, value }).catch(logError);
    }

    return (
        <Col>
            <Form.Label htmlFor={`playerCurrency${currency.currency_id}`}>{currency.Currency.name}:</Form.Label>
            <BottomTextInput id={`playerCurrency${currency.currency_id}`} value={value}
                onChange={ev => setValue(ev.currentTarget.value)} onBlur={onBlur} className='ms-2'
                style={{maxWidth: '7rem'}} />
        </Col>
    );
}