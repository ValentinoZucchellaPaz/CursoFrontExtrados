import { IconButton, Tooltip } from '@mui/joy';
import { APICard } from '../../store/types';
import './CardSection.css';
import { MdClose } from 'react-icons/md';

type CardSectionProps = {
	title: string
	cards: APICard[]
	onAdd?: (card: APICard) => void
	onRemove?: (id: number) => void
	disabled?: boolean
	showRemove?: boolean
	filterIds?: number[]
}

export default function CardSection({ title, cards, onAdd, onRemove, disabled = false, showRemove = false, filterIds = [] }: CardSectionProps) {
	return (
		<div className="card-section">
			<h3>{title}</h3>
			<div className="card-grid">
				{cards.map(card => {
					const isBlocked = filterIds.includes(card.id)

					return (
						<div
							key={card.id}
							className={`card-item ${disabled || isBlocked ? "disabled" : ""}`}
							onClick={() => (!disabled && !isBlocked && onAdd?.(card))}
						>

							<img src={card.ilustracion} alt={card.nombre} />
							<h3>{card.nombre}</h3>

							{showRemove && (
								<IconButton
									onClick={(e) => {
										e.stopPropagation()
										onRemove?.(card.id)
									}}
									size="sm"
									variant="plain"
									color="danger"
									sx={{
										position: 'absolute', top: 0, right: 0,
										borderRadius: '50%'
									}}
								>
									<MdClose />
								</IconButton>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
