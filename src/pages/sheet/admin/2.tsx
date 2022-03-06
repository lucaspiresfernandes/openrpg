import { GetServerSidePropsContext } from 'next';
import { sessionSSR } from '../../../utils/session';

export default function Admin2(): JSX.Element {
    return <></>;
}

export const getServerSideProps = sessionSSR(
    async function getServerSideProps(ctx: GetServerSidePropsContext) {
        const user = ctx.req.session.player;
        if (!user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            };
        }
        return { props: {} };
    }
);