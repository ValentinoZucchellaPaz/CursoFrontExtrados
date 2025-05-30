import { useEffect, useState } from "react";
import { MdNightlight, MdSunny } from 'react-icons/md'
import "./ThemeToggle.css";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		// Cargar tema desde localStorage o usar preferencia del sistema
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initialTheme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";
		setTheme(initialTheme);
		document.documentElement.setAttribute("data-theme", initialTheme);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<button className="theme-toggle" onClick={toggleTheme}>
			{theme === "light" ? <MdNightlight /> : <MdSunny />}
		</button>
	);
}
