import { useEffect } from 'react';
import { useColorScheme } from '@mui/joy/styles';

export default function ThemeSyncer({ children }: { children: React.ReactNode }) {
	const { setMode } = useColorScheme();

	useEffect(() => {
		const themeAttr = document.documentElement.getAttribute('data-theme');
		if (themeAttr === 'light' || themeAttr === 'dark') {
			setMode(themeAttr);
		}

		const observer = new MutationObserver(() => {
			const newTheme = document.documentElement.getAttribute('data-theme');
			if (newTheme === 'light' || newTheme === 'dark') {
				setMode(newTheme);
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});

		return () => observer.disconnect();
	}, [setMode]);

	return <>{children}</>;
}

