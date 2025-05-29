// components/Footer.tsx
import './Footer.css';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer__top">
				<h2 className="footer__logo">Valentino Zucchella Paz</h2>
				<p className="footer__text">Desarrollado con 💻 y ☕ desde el Córdoba, Argentina</p>
			</div>
			<div className="footer__socials">
				<a href="https://github.com/ValentinoZucchellaPaz" target="_blank" rel="noopener noreferrer" title="GitHub">
					<FaGithub />
				</a>
				<a href="https://www.linkedin.com/in/valentino-zucchella-paz-7230b0243/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
					<FaLinkedin />
				</a>
				<a href="https://www.instagram.com/tinozp/" target="_blank" rel="noopener noreferrer" title="Twitter">
					<FaInstagram />
				</a>
				<a href="mailto:vzucchellapaz@gmail.com" title="Email">
					<FaEnvelope />
				</a>
			</div>
			<div className="footer__bottom">
				<p>&copy; {new Date().getFullYear()} Valentino Zucchella Paz. Todos los derechos reservados.</p>
			</div>
		</footer>
	);
}
