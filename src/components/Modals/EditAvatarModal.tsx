import { AttributeStatus } from '@prisma/client';
import { ChangeEvent, useContext, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { ErrorLogger } from '../../contexts';
import api from '../../utils/api';
import SheetModal from './SheetModal';

type EditAvatarModalProps = {
    attributeStatus: AttributeStatus[];
    show?: boolean;
    onHide?(): void;
    onUpdate(): void;
}

export default function EditAvatarModal(props: EditAvatarModalProps) {
    const [files, setFiles] = useState<{ id: number, file: File }[]>(new Array(props.attributeStatus.length + 1));
    const logError = useContext(ErrorLogger);

    function onHide() {
        setFiles(new Array(props.attributeStatus.length + 1));
        if (props.onHide) props.onHide();
    }

    function onUpdateAvatar() {
        const form = new FormData();
        let anyEntry = false;
        const ids: number[] = [];
        for (const file of files) {
            if (!file) continue;
            anyEntry = true;
            form.append('file', file.file);
            form.append('attrID', file.id.toString());
            ids.push(file.id);
        }

        if (!anyEntry) return;

        api.post('/sheet/player/avatar', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(props.onUpdate).catch(logError);
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
            onHide={onHide} scrollable>
            <Container fluid>
                <Row className='mb-3 h4 text-center'>
                    <Col>
                        Caso vá usar a extensão do OBS, é recomendado que as imagens estejam
                        no tamanho de <b>420x600</b> e em formato <b>PNG</b>.
                    </Col>
                </Row>
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