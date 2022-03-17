import Head from 'next/head';
import config from '../../openrpg.config.json';

type ApplicationHeadProps = {
    title?: string,
    children?: React.ReactElement
};

export default function AppHead({ title, children }: ApplicationHeadProps) {
    return (
        <Head>
            <title>{`${title || ''} - ${config.application.name}`}</title>
            <meta name="description" content={config.application.description} />
            <link rel="icon" href="/favicon.ico" />
            {children}
        </Head>
    );
}