import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';
import { applySimplePageSeo, resetToSiteDefaults } from '../utils/seo';
import './RecommendationQuiz.css';

const RecommendationQuiz = () => {
    const [form, setForm] = useState({
        monthlySpend: 2500,
        rewardsPreference: 'points',
        annualFeeTolerance: 'medium',
        wantsTravelPerks: true,
        foreignFeeSensitive: false,
        carriesBalance: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        applySimplePageSeo({
            title: 'Card recommendation quiz',
            description: 'Answer a few questions to get ranked Australian credit card recommendations.',
            path: '/quiz',
            keywords: ['credit card recommendation quiz', 'best credit card australia', 'card ranking tool']
        });
        trackEvent('recommendation_quiz_viewed');
        return () => resetToSiteDefaults();
    }, []);

    const hasResults = results.length > 0;
    const topPick = hasResults ? results[0] : null;

    const quizSummary = useMemo(
        () => ({
            spendBand:
                Number(form.monthlySpend) < 1500 ? 'low spend' : Number(form.monthlySpend) < 4000 ? 'mid spend' : 'high spend',
            preference: form.rewardsPreference,
            feeTolerance: form.annualFeeTolerance
        }),
        [form]
    );

    const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const submitQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);

        trackEvent('recommendation_quiz_submitted', quizSummary);

        try {
            const res = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error('Could not fetch recommendations');
            const payload = await res.json();
            setResults(payload.recommendations || []);
            trackEvent('recommendation_results_loaded', { resultsCount: (payload.recommendations || []).length });
        } catch {
            setError('Could not calculate recommendations right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-page container">
            <div className="quiz-header">
                <h1>Recommendation Quiz</h1>
                <p>Tell us how you spend and we will rank cards based on value, fee fit, and perks.</p>
            </div>

            <div className="quiz-layout">
                <form className="quiz-form glass" onSubmit={submitQuiz}>
                    <div className="form-group">
                        <label htmlFor="monthlySpend">Monthly card spend (AUD)</label>
                        <input
                            id="monthlySpend"
                            type="number"
                            min="0"
                            step="100"
                            value={form.monthlySpend}
                            onChange={(e) => updateField('monthlySpend', Number(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rewardsPreference">Preferred rewards type</label>
                        <select
                            id="rewardsPreference"
                            value={form.rewardsPreference}
                            onChange={(e) => updateField('rewardsPreference', e.target.value)}
                        >
                            <option value="points">Points</option>
                            <option value="cashback">Cashback</option>
                            <option value="either">Either</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="annualFeeTolerance">Annual fee tolerance</label>
                        <select
                            id="annualFeeTolerance"
                            value={form.annualFeeTolerance}
                            onChange={(e) => updateField('annualFeeTolerance', e.target.value)}
                        >
                            <option value="low">Low (up to $100)</option>
                            <option value="medium">Medium (up to $300)</option>
                            <option value="high">High (premium cards OK)</option>
                        </select>
                    </div>

                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={form.wantsTravelPerks}
                            onChange={(e) => updateField('wantsTravelPerks', e.target.checked)}
                        />
                        I want travel perks (lounges, flights, travel insurance)
                    </label>

                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={form.foreignFeeSensitive}
                            onChange={(e) => updateField('foreignFeeSensitive', e.target.checked)}
                        />
                        I care about reducing foreign transaction fees
                    </label>

                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={form.carriesBalance}
                            onChange={(e) => updateField('carriesBalance', e.target.checked)}
                        />
                        I sometimes carry a balance month to month
                    </label>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Ranking cards...' : 'Get my recommendations'}
                    </button>
                </form>

                <div className="quiz-results glass">
                    <h2>Your ranked matches</h2>
                    {error && <p className="quiz-error">{error}</p>}
                    {!error && !hasResults && <p className="quiz-muted">Submit the quiz to see your top 5 recommendations.</p>}

                    {topPick && (
                        <div className="top-pick">
                            <p className="top-pick-label">Top pick</p>
                            <h3>{topPick.name}</h3>
                            <p>{topPick.description}</p>
                            <div className="top-pick-meta">
                                <span>Score: {topPick.score}</span>
                                <span>Annual fee: ${topPick.fees?.annual ?? 'N/A'}</span>
                                <span>Rate: {topPick.interestRate}%</span>
                            </div>
                            <Link className="btn btn-secondary btn-sm" to={`/cards/${topPick.id}`}>
                                View card details
                            </Link>
                        </div>
                    )}

                    {hasResults && (
                        <ul className="results-list">
                            {results.map((card, idx) => (
                                <li key={card.id} className="result-item">
                                    <div className="result-title-row">
                                        <strong>{idx + 1}. {card.name}</strong>
                                        <span className="score-pill">{card.score}</span>
                                    </div>
                                    <p className="result-meta">
                                        {card.category} · ${card.fees?.annual ?? 'N/A'} annual fee · {card.pointsRate}
                                    </p>
                                    <ul className="rationale-list">
                                        {(card.rationale || []).map((reason) => <li key={reason}>{reason}</li>)}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationQuiz;
