"use client";
import { useState } from 'react';
import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { decodeToken } from '../../utils/decodeToken';

interface LinkProp {
	url: string
	title: string
	external: boolean
}

interface NavbarProps {
	links: LinkProp[]
}

const NavBar = ({ links = [] }: NavbarProps) => {
	const [menuOpen, setMenuOpen] = useState(false)

	const navigate = useNavigate()
	return (
		<header className='header-main'>
			<nav className='nav'>
				<div className="nav-container">
					<div className="logo">
						<img src="/logo_chico.png" alt="logo" onClick={() => navigate("/")} />
					</div>

					<button className='menu-toggle' onClick={() => setMenuOpen(prev => !prev)}>
						☰
					</button>

					<ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
						{
							links.map(link => (
								link.external ?
									<li key={link.url}>
										<a href={link.url} target='_blank' rel='noopener noreferrer'>{link.title}</a>
									</li>
									:
									<li key={link.url}>
										<Link to={link.url}>{link.title}</Link>
									</li>
							))
						}
					</ul>
				</div>

			</nav>
		</header>
	);
};

export default NavBar;