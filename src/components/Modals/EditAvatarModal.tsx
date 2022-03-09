import { AttributeStatus } from '@prisma/client';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { toastsContext } from '../../pages/sheet/2';
import api from '../../utils/api';
import SheetModal from './SheetModal';

type EditAvatarModalProps = {
    attributeStatus: AttributeStatus[];
    show?: boolean;
    onHide?(): void;
}

export default function EditAvatarModal(props: EditAvatarModalProps) {
    const [files, setFiles] = useState<{ id: number, file: File }[]>(new Array(props.attributeStatus.length + 1));
    const addToast = useContext(toastsContext);

    function onHide() {
        setFiles(new Array(props.attributeStatus.length + 1));
        if (props.onHide) props.onHide();
    }

    function onUpdateAvatar() {
        const form = new FormData();
        let anyEntry = false;
        for (const file of files) {
            if (!file) continue;
            anyEntry = true;
            form.append('file', file.file);
            form.append('attrID', file.id.toString());
        }

        if (!anyEntry) return;

        api.post('/sheet/player/avatar', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            
            console.log(res.status);
        }).catch(addToast);
    }

    function onFileChange(index: number, id: number, ev: ChangeEvent<HTMLInputElement>) {
        let auxFiles = ev.currentTarget.files;
        if (auxFiles) {
            const newFiles = [...files];
            newFiles[index] = { id, file: auxFiles[0] };
            setFiles(newFiles);
        }
    }

    return (
        <SheetModal title='Editar Avatar' applyButton={{ name: 'Atualizar', onApply: onUpdateAvatar }} show={props.show}
            onHide={onHide}>
            <Container fluid>
                <Form.Group className='mb-3'>
                    <Form.Label>Avatar</Form.Label>
                    <Form.Control type='file' accept='image/*'
                        onChange={ev => onFileChange(0, 0, ev as ChangeEvent<HTMLInputElement>)} />
                </Form.Group>
                {props.attributeStatus.map((stat, index) =>
                    <Form.Group key={stat.id} className='mb-3'>
                        <Form.Label>Avatar ({stat.name})</Form.Label>
                        <Form.Control type='file' accept='image/*'
                            onChange={ev => onFileChange(index + 1, stat.id, ev as ChangeEvent<HTMLInputElement>)} />
                    </Form.Group>
                )}
            </Container>
        </SheetModal>
    );
}