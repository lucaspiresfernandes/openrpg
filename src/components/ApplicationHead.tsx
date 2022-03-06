import Head from 'next/head';
import config from '../../openrpg.config.json';

type ApplicationHeadProps = {
    title?: string,
    description?: string,
    children?: JSX.Element
};

export default function AppHead({ title, description, children }: ApplicationHeadProps) : JSX.Element {
    return (
        <Head>
            <title>{title || config.application.name}</title>
            <meta name="description" content={description || config.application.description} />
            <link rel="icon" href="/favicon.ico" />
            {children}
        </Head>
    );
}