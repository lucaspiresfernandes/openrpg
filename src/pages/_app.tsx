import '../styles/globals.scss';
import { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Navbar from '../components/Navbar';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<Navbar />
			<Component {...pageProps} />
		</SSRProvider>
	);
}
