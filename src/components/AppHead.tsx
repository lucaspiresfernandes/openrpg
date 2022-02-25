import Head from 'next/head'
import config from '../../openrpg.config.json'

type AppHeadProps = {
    title?: string,
    description?: string,
    children?: JSX.Element
};

export default function AppHead(props : AppHeadProps): JSX.Element {
    return (
        <Head>
            <title>{props.title || config.application_name}</title>
            <meta name="description" content={props.description || config.application_description} />
            <link rel="icon" href="/favicon.ico" />
            {props.children}
        </Head>
    );
}