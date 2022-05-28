declare var prisma: PrismaClient;

declare type EditorModalData<T> = {
	operation: 'edit' | 'create';
	show: boolean;
	data?: T;
};

declare type EditorModalProps<T> = EditorModalData<T> & {
	disabled?: boolean;
	onSubmit: (data: T) => void;
	onHide: () => void;
};
