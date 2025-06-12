import { useEffect, useState } from "react";
import { MdNightlight, MdSunny } from 'react-icons/md'
import "./ThemeToggle.css";

// export default function ThemeToggle() {
// 	const [theme, setTheme] = useState<"light" | "dark">("dark");

// 	useEffect(() => {
// 		// Cargar tema desde localStorage o usar preferencia del sistema
// 		const savedTheme = localStorage.getItem("theme");
// 		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
// 		const initialTheme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";
// 		setTheme(initialTheme);
// 		document.documentElement.setAttribute("data-theme", initialTheme);
// 	}, []);

// 	const toggleTheme = () => {
// 		const newTheme = theme === "light" ? "dark" : "light";
// 		setTheme(newTheme);
// 		document.documentElement.setAttribute("data-theme", newTheme);
// 		localStorage.setItem("theme", newTheme);
// 	};

// 	return (
// 		<button className="theme-toggle" onClick={toggleTheme}>
// 			{theme === "light" ? <MdNightlight /> : <MdSunny />}
// 		</button>
// 	);
// }
import { useColorScheme } from '@mui/joy/styles';

export default function ThemeToggle() {
	const { mode, setMode } = useColorScheme();

	const toggleTheme = () => {
		const newMode = mode === 'light' ? 'dark' : 'light';
		setMode(newMode);
		localStorage.setItem("theme", newMode);
		document.documentElement.setAttribute("data-theme", newMode);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
		setMode(initialTheme as "light" | "dark");
		document.documentElement.setAttribute("data-theme", initialTheme);
	}, []);

	return (
		<button className="theme-toggle" onClick={toggleTheme}>
			{mode === "light" ? <MdNightlight /> : <MdSunny />}
		</button>
	);
}
