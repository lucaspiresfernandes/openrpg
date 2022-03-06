import { Col, Row } from 'react-bootstrap';

type DataContainerProps = {
    title: string,
    children?: JSX.Element | JSX.Element[]
}

export default function DataContainer({ title, children }: DataContainerProps) {
    return (
        <Col className='data-container h-100 my-3'>
            <Row className='mt-2 text-center'>
                <Col className='h2'>{title}</Col>
                <hr />
            </Row>
            {children}
        </Col>
    );
}