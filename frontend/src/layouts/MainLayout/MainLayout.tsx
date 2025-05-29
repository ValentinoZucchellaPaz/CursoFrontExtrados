import React, { ReactNode } from 'react';
import './MainLayout.css';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../../components/Navbar/Navbar';
import { links } from '../../utils/navLinks';
import { Footer } from '../../components/Footer';

export type MainLayoutProps = {
	children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { pathname } = useLocation()

	const hideLayout = ["/login"]

	const shouldHideLayout = hideLayout.includes(pathname);

	return (
		<div className='mainlayout'>
			{!shouldHideLayout && <NavBar links={links} />}
			<main className='content'>
				{/* <Outlet /> */}
				{children}
			</main>
			{!shouldHideLayout && <Footer />}
		</div>
	);
};

export default MainLayout;
