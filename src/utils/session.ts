import type { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type { GetServerSidePropsContext, NextApiHandler, NextApiRequest } from 'next';
import type { NextApiResponseServerIO } from './socket';

export const cookieName = 'openrpg_session';

declare module 'iron-session' {
	interface IronSessionData {
		player?: {
			id: number;
			admin: boolean;
		};
	}
}

const sessionOptions: IronSessionOptions = {
	cookieName,
	password: process.env.SESSION_SECRET as string,
	cookieOptions: {
		secure: false,
	},
};

type NextApiServerIOHandler<T = any> = (
	req: NextApiRequest,
	res: NextApiResponseServerIO<T>
) => void | Promise<void>;

export function sessionAPI(handler: NextApiHandler | NextApiServerIOHandler) {
	return withIronSessionApiRoute(handler as NextApiHandler, sessionOptions);
}

export function sessionSSR(
	handler: (context: GetServerSidePropsContext) => Promise<any>
) {
	return withIronSessionSsr(handler, sessionOptions);
}
