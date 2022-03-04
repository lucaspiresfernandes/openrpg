import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

declare module 'iron-session' {
    interface IronSessionData {
      user: {
        id: number;
        admin: boolean;
      };
    }
  }

const sessionOptions: IronSessionOptions = {

    cookieName: 'openrpgcookiesession',
    password: String(process.env.SESSION_SECRET),
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export function sessionAPI(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function sessionSSR<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (
        context: GetServerSidePropsContext,
      ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
    ) {
    return withIronSessionSsr(handler, sessionOptions);
}