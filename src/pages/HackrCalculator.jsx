import { useState } from 'react';
import { Calculator, DollarSign, Award } from 'lucide-react';
import { cardsData } from '../data/cardsData';
import './HackrCalculator.css';

const HackrCalculator = () => {
    const [selectedCardId, setSelectedCardId] = useState(cardsData[0]?.id || '');
    const [monthlySpend, setMonthlySpend] = useState('');

    const selectedCard = cardsData.find(c => c.id === parseInt(selectedCardId));

    const calculatePoints = () => {
        if (!selectedCard || !monthlySpend) return 0;
        // Use defined earnRate or default to 0 if not present
        const rate = selectedCard.earnRate !== undefined ? selectedCard.earnRate : 0;
        return Math.floor(parseInt(monthlySpend) * rate * 12); // Yearly points
    };

    const yearlyPoints = calculatePoints();
    // Use defined pointValue or default to 0
    const valPerPoint = selectedCard?.pointValue || 0;
    const estimatedValue = (yearlyPoints * valPerPoint).toFixed(2);
    const netValue = (parseFloat(estimatedValue) - (selectedCard?.fees.annual || 0)).toFixed(2);

    return (
        <div className="calculator-page">
            <div className="container">
                <div className="calculator-header">
                    <h1>HACKR <span className="text-gradient">Calculator</span></h1>
                    <p>Estimate your rewards and find out if a card is worth the annual fee.</p>
                </div>

                <div className="calc-layout">
                    {/* Input Section */}
                    <div className="calc-inputs glass">
                        <h2><Calculator size={24} /> Parameters</h2>

                        <div className="form-group">
                            <label>Select Card</label>
                            <select
                                value={selectedCardId}
                                onChange={(e) => setSelectedCardId(e.target.value)}
                                className="calc-select"
                            >
                                {cardsData.map(card => (
                                    <option key={card.id} value={card.id}>{card.name} (${card.fees.annual}/yr)</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Monthly Spend ($)</label>
                            <div className="input-with-icon">
                                <DollarSign size={18} className="input-icon" />
                                <input
                                    type="number"
                                    value={monthlySpend}
                                    onChange={(e) => setMonthlySpend(e.target.value)}
                                    placeholder="e.g. 2000"
                                    min="0"
                                />
                            </div>
                        </div>

                        {selectedCard && (
                            <div className="calc-card-preview">
                                <img src={selectedCard.image} alt={selectedCard.name} />
                                <div className="calc-card-info">
                                    <strong>{selectedCard.name}</strong>
                                    <span>{selectedCard.pointsRate}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="calc-results glass">
                        <h2>Your Potential Return</h2>

                        {monthlySpend ? (
                            <div className="results-content">
                                <div className="result-row primary-result">
                                    <span className="result-label"><Award size={20} /> Yearly Points</span>
                                    <span className="result-value">{yearlyPoints.toLocaleString()} pts</span>
                                </div>

                                <div className="result-divider"></div>

                                <div className="result-row">
                                    <span className="result-label">Est. Value ({(valPerPoint * 100).toFixed(2)}c/pt)</span>
                                    <span className="result-value">${estimatedValue}</span>
                                </div>
                                <div className="result-row negative">
                                    <span className="result-label">Less Annual Fee</span>
                                    <span className="result-value">-${selectedCard?.fees.annual}</span>
                                </div>

                                <div className="result-divider"></div>

                                <div className="result-row final-result">
                                    <span className="result-label">Net Yearly Value</span>
                                    <span className={`result-value ${parseFloat(netValue) >= 0 ? 'positive' : 'negative'}`}>
                                        ${netValue}
                                    </span>
                                </div>

                                {parseFloat(netValue) < 0 && (
                                    <div className="calc-tip">
                                        <p>Tip: You might not be spending enough to offset the annual fee on this card. Try a Low Fee card!</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="results-placeholder">
                                <p>Enter your monthly spend to see the calculation.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HackrCalculator;
