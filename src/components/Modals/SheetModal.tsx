import type { FormEvent, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal, { ModalProps } from 'react-bootstrap/Modal';

interface SheetModalProps extends ModalProps {
	children?: React.ReactNode;
	applyButton?: {
		name: string;
		onApply: (ev: MouseEvent | FormEvent | undefined) => any;
		disabled?: boolean;
	};
	closeButton?: {
		name?: string;
		disabled?: boolean;
	};
	bodyStyle?: React.CSSProperties;
	onCancel?: () => void;
}

export default function SheetModal({
	title,
	children,
	applyButton,
	closeButton,
	bodyStyle,
	onCancel,
	...props
}: SheetModalProps) {
	function submit(ev: FormEvent<HTMLFormElement>) {
		ev.preventDefault();
		applyButton?.onApply(ev);
	}

	return (
		<Modal {...props}>
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={submit} style={{ display: 'contents' }}>
				<Modal.Body style={bodyStyle}>{children}</Modal.Body>
				<Modal.Footer>
					{applyButton && (
						<Button type='submit' variant='primary' disabled={applyButton.disabled}>
							{applyButton.name}
						</Button>
					)}
					<Button
						variant='secondary'
						onClick={() => {
							onCancel?.();
							props.onHide?.();
						}}
						disabled={closeButton?.disabled || false}>
						{closeButton?.name || 'Fechar'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}
