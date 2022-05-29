declare var prisma: PrismaClient;

declare type ReducerActions<T> = {
	[K in keyof T]: {
		type: K;
		data: T[K];
	};
}[keyof T];

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
