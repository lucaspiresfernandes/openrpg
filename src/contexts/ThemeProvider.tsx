import { useEffect, useState } from 'react';
import type { ApplicationTheme } from './theme';
import { ThemeManager } from './theme';

type ThemeProviderProps = {
	children: React.ReactNode;
};

export default function ThemeProvider(props: ThemeProviderProps) {
	const [theme, setTheme] = useState<ApplicationTheme>(() => {
		if (typeof window !== 'undefined')
			return (localStorage.getItem('application_theme') || 'dark') as ApplicationTheme;
		return 'dark';
	});

	function changeTheme(theme: ApplicationTheme) {
		setTheme(theme);
	}

	useEffect(() => {
		switch (theme) {
			case 'light':
				localStorage.setItem('application_theme', 'light');
				document.body.classList.remove('dark');
				document.body.classList.add('light');
				break;
			case 'dark':
				localStorage.setItem('application_theme', 'dark');
				document.body.classList.remove('light');
				document.body.classList.add('dark');
				break;
		}
	}, [theme]);

	return (
		<ThemeManager.Provider value={{ currentTheme: theme, changeTheme }}>
			{props.children}
		</ThemeManager.Provider>
	);
}
