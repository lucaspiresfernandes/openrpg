import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler, GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest } from 'next';
import { NextApiResponseServerIO } from './index';

export const cookieName = 'openrpgcookiesession';

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
    secure: process.env.NODE_ENV === 'production',
  },
};

type NextApiServerIOHandler<T = any> = (req: NextApiRequest, res: NextApiResponseServerIO<T>) => void | Promise<void>;

export function sessionAPI(handler: NextApiHandler | NextApiServerIOHandler) {
  return withIronSessionApiRoute(handler as NextApiHandler, sessionOptions);
}

export function sessionSSR(handler: (context: GetServerSidePropsContext) => Promise<any>) {
  return withIronSessionSsr(handler, sessionOptions);
}