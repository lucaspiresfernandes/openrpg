import Button from 'react-bootstrap/Button';
import type { ColProps } from 'react-bootstrap/Col';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import CustomSpinner from './CustomSpinner';

interface DataContainerProps extends ColProps {
	title: string;
	children?: React.ReactNode;
	addButton?: {
		name?: string;
		type?: 'button' | 'dropdown';
		onAdd?: () => void;
		children?: React.ReactNode;
		disabled?: boolean;
	};
	htmlFor?: string;
	outline?: boolean;
}

export default function DataContainer({
	title,
	children,
	addButton,
	htmlFor,
	outline,
	...props
}: DataContainerProps) {
	const _title = htmlFor ? <label htmlFor={htmlFor}>{title}</label> : <>{title}</>;

	return (
		<Col {...props} className={props.className}>
			<Row className={outline ? 'data-container' : undefined}>
				<Col>
					{addButton ? (
						<Row className='mx-1 text-center'>
							<Col xs={{ offset: 2 }} className='mt-2 h2'>
								{_title}
							</Col>
							<Col xs={2} className='align-self-center'>
								{addButton.type === 'dropdown' ? (
									<DropdownButton
										size='sm'
										title={addButton.name || '+'}
										variant='secondary'
										menuVariant='dark'
										disabled={addButton.disabled}>
										{addButton.children}
									</DropdownButton>
								) : (
									<Button
										variant='secondary'
										onClick={addButton.onAdd}
										disabled={addButton.disabled}
										size='sm'>
										{addButton.disabled ? <CustomSpinner /> : addButton.name || '+'}
									</Button>
								)}
							</Col>
							<hr />
						</Row>
					) : (
						<Row className='mx-1'>
							<Col className='mt-2 h2 text-center'>{_title}</Col>
							<hr />
						</Row>
					)}
					{children}
				</Col>
			</Row>
		</Col>
	);
}
