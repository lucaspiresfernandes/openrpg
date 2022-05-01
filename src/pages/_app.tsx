import '../styles/globals.scss';
import { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';
import ThemeProvider from '../contexts/ThemeProvider';
import Navbar from '../components/Navbar';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<ThemeProvider>
				<Navbar />
			</ThemeProvider>
			<Component {...pageProps} />
		</SSRProvider>
	);
}
