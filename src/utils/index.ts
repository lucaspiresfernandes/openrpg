export function clamp(num: number, min: number, max: number) {
	if (num < min) return min;
	if (num > max) return max;
	return num;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((res) => setTimeout(res, ms));
}

type GetSSRResult<TProps> = { props: TProps } | { redirect: any } | { notFound: true };

type GetSSRFn<TProps extends any> = (args: any) => Promise<GetSSRResult<TProps>>;

export type InferSSRProps<TFn extends GetSSRFn<any>> = TFn extends GetSSRFn<infer TProps>
	? NonNullable<TProps>
	: never;
