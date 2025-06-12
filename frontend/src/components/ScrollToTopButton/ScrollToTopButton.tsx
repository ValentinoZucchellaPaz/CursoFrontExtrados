import { useEffect, useState } from 'react';
import { IconButton } from '@mui/joy';
import { MdArrowUpward } from 'react-icons/md';

export default function ScrollTopButton() {
	const [showScroll, setShowScroll] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowScroll(window.scrollY > 100); // cambia el 100 por el scroll deseado
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		showScroll && (
			<IconButton
				variant="solid"
				color="primary"
				onClick={handleClick}
				sx={{
					position: 'fixed',
					bottom: '2rem',
					right: '2rem',
					zIndex: 1000,
					boxShadow: 'md',
				}}
			>
				<MdArrowUpward />
			</IconButton>
		)
	);

}