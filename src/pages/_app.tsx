import '../styles/globals.scss';
import { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<Component {...pageProps} />
		</SSRProvider>
	);
}
