"use client";
import React, { useState } from 'react';
import './NavBar.css';
import logo from "../../assets/logo_chico.png"
import { Link } from 'react-router-dom';

const NavBar = ({ links = [] }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	return (
		<header className='header-main'>
			<nav className='nav'>
				<div className="nav-container">
					<div className="logo">
						<img src={logo} alt="logo" />
					</div>

					<button className='menu-toggle' onClick={() => setMenuOpen(prev => !prev)}>
						☰
					</button>

					<ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
						{
							links.map(link => (
								link.external ?
									<li>
										<a href={link.url} target='_blank' rel='noopener noreferrer'>{link.title}</a>
									</li>
									:
									<li>
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