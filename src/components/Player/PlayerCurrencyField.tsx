import { Currency, PlayerCurrency } from '@prisma/client';
import { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerCurrencyFieldProps = {
    currency: {
        value: string;
        Currency: Currency;
    };
}

export default function PlayerCurrencyField({ currency }: PlayerCurrencyFieldProps) {
    const logError = useContext(ErrorLogger);
    const [lastValue, value, setValue] = useExtendedState(currency.value);

    function onBlur() {
        if (lastValue === value) return;
        setValue(value);
        api.post('/sheet/player/currency', { id: currency.Currency.id, value }).catch(logError);
    }

    return (
        <Col xs={6} lg={4}>
            <Form.Label htmlFor={`playerCurrency${currency.Currency.id}`}>{currency.Currency.name}:</Form.Label>
            <BottomTextInput id={`playerCurrency${currency.Currency.id}`} value={value}
                onChange={ev => setValue(ev.currentTarget.value)} onBlur={onBlur} className='ms-2'
                style={{ maxWidth: '7rem' }} autoComplete='off' />
        </Col>
    );
}