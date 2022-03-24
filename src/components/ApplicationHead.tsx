import Head from 'next/head';
import config from '../../openrpg.config.json';

type ApplicationHeadProps = {
    title?: string,
    children?: React.ReactElement
};

export default function ApplicationHead({ title, children }: ApplicationHeadProps) {
    return (
        <Head>
            <title>{`${title || ''} - ${config.application_name}`}</title>
            <meta name="description" content='Powered by Open RPG. Para saber mais: https://github.com/alyssapiresfernandescefet/openrpg' />
            <link rel="icon" href="/favicon.ico" />
            {children}
        </Head>
    );
}