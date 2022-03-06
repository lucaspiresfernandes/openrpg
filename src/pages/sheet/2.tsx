import { GetServerSidePropsContext } from 'next';
import SheetNavbar from '../../components/SheetNavbar';
import { sessionSSR } from '../../utils/session';

export default function Sheet2(): JSX.Element {
    return (
        <>
            <SheetNavbar />
        </>
    );
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