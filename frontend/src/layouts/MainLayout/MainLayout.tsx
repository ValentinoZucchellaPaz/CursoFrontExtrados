import React from 'react';
import './MainLayout.css';
import { Outlet } from 'react-router-dom';

export type MainLayoutProps = {
}

const MainLayout: React.FC<MainLayoutProps> = ({ }) => {
	return (
		<div className='mainlayout'>
			{/* <header className='header-main'>
				<Navbar links={links} />
			</header> */}
			<main className='content'>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
