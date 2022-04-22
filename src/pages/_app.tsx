import '../styles/globals.scss';
import { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<Head>
				<meta
					name='description'
					content='Site criado pelo aplicativo Open RPG. Para saber mais: https://github.com/alyssapiresfernandescefet/openrpg'
				/>
			</Head>
			<Component {...pageProps} />
		</SSRProvider>
	);
}
