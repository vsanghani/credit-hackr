import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { cardsData } from '../data/cardsData';
import './CardDetail.css';

const CardDetail = () => {
    const { id } = useParams();
    const card = cardsData.find(c => c.id === parseInt(id));

    if (!card) {
        return (
            <div className="container not-found">
                <h2>Card not found</h2>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="card-detail-page">
            <div className="container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} /> Back to Cards
                </Link>

                {/* Header Section */}
                <div className="detail-header glass">
                    <div className="detail-image-wrapper">
                        <img src={card.image} alt={card.name} />
                    </div>
                    <div className="detail-title-section">
                        <span className="detail-category">{card.category}</span>
                        <h1>{card.name}</h1>
                        <p className="detail-description">{card.description}</p>
                        <div className="detail-cta">
                            <a href={card.applyLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
                                Apply Now
                            </a>
                            <span className="secure-text">
                                <AlertCircle size={14} /> Secure Application via Bank
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-grid">
                    {/* Main Info */}
                    <div className="detail-main">
                        <div className="content-block glass">
                            <h2>Key Benefits</h2>
                            <ul className="benefits-list">
                                {card.benefits.map((benefit, index) => (
                                    <li key={index}>
                                        <Check className="check-icon" size={20} />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="content-block glass">
                            <h2>The Fine Print</h2>
                            <div className="fine-print-grid">
                                <div className="fp-item">
                                    <span className="fp-label">Purchase Interest Rate</span>
                                    <span className="fp-value">{card.interestRate}% p.a.</span>
                                </div>
                                <div className="fp-item">
                                    <span className="fp-label">Annual Fee</span>
                                    <span className="fp-value">${card.fees.annual}</span>
                                </div>
                                <div className="fp-item">
                                    <span className="fp-label">Foreign Transaction Fee</span>
                                    <span className="fp-value">{card.fees.foreign}%</span>
                                </div>
                                <div className="fp-item">
                                    <span className="fp-label">Earn Rate</span>
                                    <span className="fp-value">{card.pointsRate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="detail-sidebar">
                        <div className="summary-card glass">
                            <h3>At a Glance</h3>
                            <div className="summary-row">
                                <span>Bonus</span>
                                <strong>{card.feature}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Annual Fee</span>
                                <strong>${card.fees.annual}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Interest</span>
                                <strong>{card.interestRate}%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetail;
