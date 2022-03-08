import { Button, Col, Row } from 'react-bootstrap';

type DataContainerProps = {
    title: string;
    children?: JSX.Element | JSX.Element[];
    onAdd?(): void;
    htmlFor?: string;
}

export default function DataContainer({ title, children, onAdd, htmlFor }: DataContainerProps) {
    const _title = htmlFor ?
        <label htmlFor={htmlFor}>{title}</label> :
        title;

    let head = (
        <Row className='mt-2 text-center'>
            <Col className='h2'>{_title}</Col>
            <hr />
        </Row>
    );

    if (onAdd) head = (
        <Row>
            <Col xs={{ offset: 3 }} className='mt-2 h2 text-center'>
                {_title}
            </Col>
            <Col xs={3} className='align-self-center'><Button variant='dark' onClick={onAdd}>+</Button></Col>
            <hr />
        </Row>
    );


    return (
        <Col className='data-container h-100 my-3'>
            {head}
            {children}
        </Col>
    );
}