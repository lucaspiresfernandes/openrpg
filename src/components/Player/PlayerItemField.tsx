import { FormEvent, useContext, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import styles from '../../styles/Item.module.scss';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerItemFieldProps = {
    quantity: number;
    description: string;
    item: {
        id: number;
        name: string;
    };
    onDelete(id: number): void
};

export default function PlayerItemField(props: PlayerItemFieldProps) {
    const [lastQuantity, currentQuantity, setCurrentQuantity] = useExtendedState(props.quantity);
    const [lastDescription, currentDescription, setCurrentDescription] = useExtendedState(props.description);
    const [disabled, setDisabled] = useState(false);
    const logError = useContext(ErrorLogger);
    const itemID = props.item.id;

    function deleteItem() {
        if (!confirm('Você realmente deseja excluir esse item?')) return;
        setDisabled(true);
        props.onDelete(itemID);
        api.delete('/sheet/player/item', {
            data: { id: itemID }
        }).then(() => props.onDelete(itemID)).catch(err => {
            logError(err);
            setDisabled(false);
        });
    }

    function quantityChange(ev: FormEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newQuantity = parseInt(aux);

        if (aux.length === 0) newQuantity = 0;
        else if (isNaN(newQuantity)) return;

        setCurrentQuantity(newQuantity);
    }

    function quantityBlur() {
        if (currentQuantity === lastQuantity) return;
        setCurrentQuantity(currentQuantity);
        api.post('/sheet/player/item', { id: itemID, quantity: currentQuantity }).catch(err => {
            logError(err);
            setCurrentQuantity(lastQuantity);
        });
    }

    function descriptionBlur() {
        if (currentDescription === lastDescription) return;
        setCurrentDescription(currentDescription);
        api.post('/sheet/player/item', { id: itemID, currentDescription }).catch(err => {
            logError(err);
            setCurrentDescription(lastDescription);
        });
    }

    return (
        <tr>
            <td>
                <Button onClick={deleteItem} disabled={disabled} className={styles.trashContainer} size='sm' variant='danger'>
                    <Image alt='Lixo' src='/trash.svg' className={`${styles.trash} clickable`} />
                </Button>
            </td>
            <td className={styles.name}>{props.item.name}</td>
            <td>
                <BottomTextInput className={`${styles.description} w-100`} value={currentDescription}
                    onChange={ev => setCurrentDescription(ev.currentTarget.value)} onBlur={descriptionBlur} />
            </td>
            <td>
                <BottomTextInput type='number' className={`${styles.quantity}`} maxLength={3}
                    value={currentQuantity} onChange={quantityChange}
                    onBlur={quantityBlur} />
            </td>
        </tr>
    );
}