
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
	return (
		<div className="not-found">
			<h1>404</h1>
			<p>Oops... ¡La página que buscás no existe!</p>
			<Link to="/">Volver al inicio</Link>
		</div>
	);
};

export default NotFound;