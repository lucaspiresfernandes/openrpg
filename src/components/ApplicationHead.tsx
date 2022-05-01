import Head from 'next/head';

type ApplicationHeadProps = {
	title?: string;
	children?: React.ReactChild;
};

export default function ApplicationHead({ title, children }: ApplicationHeadProps) {
	return (
		<Head>
			<meta
				name='description'
				content='Site criado pelo aplicativo Open RPG. Para saber mais: https://github.com/alyssapiresfernandescefet/openrpg'
			/>
			<meta name='author' content='Alyssa Fernandes' />
			<title>{`${title || ''} - Open RPG`}</title>
			{children}
		</Head>
	);
}
