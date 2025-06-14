import { useState } from 'react';
import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { UserMenu } from '../UserMenu';
import { useAppSelector } from '../../store/hooks';

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
	const loggedUserId = useAppSelector(store => store.auth.userId)

	const navigate = useNavigate()
	return (
		<header className='header-main '>
			<nav className='nav '>
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
										<Link to={link.url} onClick={() => {
											menuOpen && setMenuOpen(prev => !prev)
										}}>{link.title}</Link>
									</li>
							))
						}
						<li>
							<ThemeToggle />
						</li>
					</ul>
					<div className="user-menu">
						{loggedUserId && <UserMenu id={loggedUserId} />}
					</div>
				</div>

			</nav>
		</header >
	);
};

export default NavBar;