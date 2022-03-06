import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

declare module 'iron-session' {
  interface IronSessionData {
    player: {
      id: number;
      admin: boolean;
    };
  }
}

const sessionOptions: IronSessionOptions = {

  cookieName: 'openrpgcookiesession',
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function sessionAPI(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function sessionSSR(handler: (context: GetServerSidePropsContext) => Promise<any>) {
  return withIronSessionSsr(handler, sessionOptions);
}