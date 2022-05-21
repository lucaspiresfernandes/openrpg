declare var prisma: PrismaClient;

declare type EditorModalData<T> = {
	operation: 'edit' | 'create';
	show: boolean;
	data?: T;
};
