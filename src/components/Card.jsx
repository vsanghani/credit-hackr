import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ card }) => {
    return (
        <div className="card glass">
            <div className="card-image-wrapper">
                <img src={card.image} alt={card.name} className="card-image" />
                <div className="card-category-badge">{card.category}</div>
            </div>

            <div className="card-content">
                <h3 className="card-title">{card.name}</h3>

                <div className="card-feature">
                    <span className="feature-label">Best Feature:</span>
                    <span className="feature-text">{card.feature}</span>
                </div>

                <div className="card-benefits-preview">
                    {card.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className="benefit-item">✓ {benefit}</div>
                    ))}
                </div>

                <div className="card-actions">
                    <Link to={`/cards/${card.id}`} className="btn btn-primary full-width">
                        Get Info
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Card;
