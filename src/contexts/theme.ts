import { createContext } from 'react';

export type ApplicationTheme = 'light' | 'dark';

export const ThemeManager = createContext<{
	currentTheme: ApplicationTheme;
	changeTheme(theme: ApplicationTheme): void;
}>({
	currentTheme: 'dark',
	changeTheme: () => {},
});
