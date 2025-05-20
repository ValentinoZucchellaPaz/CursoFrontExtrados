import React, { ReactNode } from 'react';
import './Card.css'; // tu archivo CSS

type CardProps = {
	title: string;
	description?: string;
	image?: string;
	footer?: React.ReactNode;
	onClick?: () => void;
	children?: ReactNode
};

const Card: React.FC<CardProps> = ({ title, description, image, footer, onClick, children }) => {
	return (
		<div className="card" onClick={onClick}>
			{image && (
				<div className="card-image">
					<img src={image} alt={title} />
				</div>
			)}
			<div className="card-content">
				<h3>{title}</h3>
				{description && <p>{description}</p>}

				{children}
			</div>
			{footer && <div className="card-footer">{footer}</div>}
		</div>
	);
};

export default Card;
