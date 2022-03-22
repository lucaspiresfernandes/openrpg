import Button from 'react-bootstrap/Button';
import Col, { ColProps } from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DropdownButton from 'react-bootstrap/DropdownButton';

interface DataContainerProps extends ColProps {
    title: string;
    children?: JSX.Element | JSX.Element[];
    addButton?: { type?: 'button' | 'dropdown', onAdd?(): void, children?: JSX.Element | JSX.Element[] };
    htmlFor?: string;
    outline?: boolean;
}

export default function DataContainer(props: DataContainerProps) {
    const _title = props.htmlFor ?
        <label htmlFor={props.htmlFor}>{props.title}</label> :
        props.title;

    function Head() {
        if (props.addButton) {
            return (
                <Row className='mx-1'>
                    <Col xs={{ offset: 3 }} className='mt-2 h2 text-center'>
                        {_title}
                    </Col>
                    <Col xs={3} className='align-self-center'>
                        {props.addButton.type === 'dropdown' ?
                            <DropdownButton title='+' variant='secondary' menuVariant='dark'>
                                {props.addButton.children}
                            </DropdownButton> :
                            <Button variant='secondary' onClick={props.addButton.onAdd}>+</Button>
                        }
                    </Col>
                    <hr />
                </Row>
            );
        }
        return (
            <Row className='mx-1'>
                <Col className='mt-2 h2 text-center'>{_title}</Col>
                <hr />
            </Row>
        );
    }



    return (
        <Col xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl} xxl={props.xxl}
            className={`${props.outline ? 'data-container ' : ''}${props.className ? props.className + ' ' : ''}h-100 my-2`}>
            <Head />
            {props.children}
        </Col>
    );
}