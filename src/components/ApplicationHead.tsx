import Head from 'next/head';

type ApplicationHeadProps = {
    title?: string,
    children?: React.ReactElement
};

export default function ApplicationHead({ title, children }: ApplicationHeadProps) {
    return (
        <Head>
            <title>{`${title || ''} - Open RPG`}</title>
            <meta name="description" content='Powered by Open RPG. Para saber mais: https://github.com/alyssapiresfernandescefet/openrpg' />
            <link rel="icon" href="/favicon.ico" />
            {children}
        </Head>
    );
}