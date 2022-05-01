import type { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<Navbar />
			<Component {...pageProps} />
		</SSRProvider>
	);
}
