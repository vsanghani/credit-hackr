import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../components/Card';
import LeadCapture from '../components/LeadCapture';
import { useCards } from '../context/CardsContext';
import { trackEvent } from '../lib/analytics';
import { applyCardsListingSeo, resetToSiteDefaults } from '../utils/seo';
import './Home.css';
import './CardsPage.css';

const CardsPage = () => {
    const { cards } = useCards();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [maxAnnualFee, setMaxAnnualFee] = useState('');
    const [maxInterestRate, setMaxInterestRate] = useState('');
    const [maxForeignFee, setMaxForeignFee] = useState('');
    const [apiCards, setApiCards] = useState([]);
    const [useApiResults, setUseApiResults] = useState(false);
    const [selectedCompareIds, setSelectedCompareIds] = useState([]);
    const location = useLocation();

    useEffect(() => {
        applyCardsListingSeo();
        return () => resetToSiteDefaults();
    }, []);

    useEffect(() => {
        // Parse query params for category or search
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        if (category) setSelectedCategory(category);
        if (search) setSearchQuery(search);

    }, [location.search]);

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        async function loadFilteredCards() {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (selectedCategory) params.set('category', selectedCategory);
            if (maxAnnualFee !== '') params.set('maxAnnualFee', maxAnnualFee);
            if (maxInterestRate !== '') params.set('maxInterestRate', maxInterestRate);
            if (maxForeignFee !== '') params.set('maxForeignFee', maxForeignFee);

            try {
                const res = await fetch(`/api/cards?${params.toString()}`, {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal
                });
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && Array.isArray(data)) {
                    setApiCards(data);
                    setUseApiResults(true);
                }
            } catch {
                if (!cancelled) setUseApiResults(false);
            }
        }

        loadFilteredCards();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [searchQuery, selectedCategory, maxAnnualFee, maxInterestRate, maxForeignFee]);

    const localFilteredCards = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return cards.filter((card) => {
            const issuer = (card.issuer || '').toLowerCase();
            const matchesSearch =
                !q ||
                card.name.toLowerCase().includes(q) ||
                card.description.toLowerCase().includes(q) ||
                card.feature.toLowerCase().includes(q) ||
                issuer.includes(q);

            const matchesCategory = selectedCategory ? card.category === selectedCategory : true;
            const matchesMaxAnnualFee = maxAnnualFee === '' ? true : card.fees?.annual <= Number(maxAnnualFee);
            const matchesMaxInterestRate = maxInterestRate === '' ? true : card.interestRate <= Number(maxInterestRate);
            const matchesMaxForeignFee = maxForeignFee === '' ? true : card.fees?.foreign <= Number(maxForeignFee);

            return matchesSearch && matchesCategory && matchesMaxAnnualFee && matchesMaxInterestRate && matchesMaxForeignFee;
        });
    }, [cards, searchQuery, selectedCategory, maxAnnualFee, maxInterestRate, maxForeignFee]);

    const filteredCards = useApiResults ? apiCards : localFilteredCards;

    const compareCards = useMemo(
        () => filteredCards.filter((card) => selectedCompareIds.includes(card.id)),
        [filteredCards, selectedCompareIds]
    );

    const categories = useMemo(
        () => [...new Set(cards.map((card) => card.category).filter(Boolean))].sort(),
        [cards]
    );

    const toggleCompareCard = (id) => {
        setSelectedCompareIds((prev) => {
            if (prev.includes(id)) {
                trackEvent('compare_removed', { cardId: id });
                return prev.filter((item) => item !== id);
            }
            if (prev.length >= 4) {
                trackEvent('compare_limit_reached', { attemptedCardId: id });
                return prev;
            }
            trackEvent('compare_added', { cardId: id });
            return [...prev, id];
        });
    };

    useEffect(() => {
        trackEvent('cards_page_viewed');
    }, []);

    useEffect(() => {
        trackEvent('cards_filters_changed', {
            searchQuery,
            selectedCategory,
            maxAnnualFee,
            maxInterestRate,
            maxForeignFee,
            resultCount: filteredCards.length
        });
    }, [searchQuery, selectedCategory, maxAnnualFee, maxInterestRate, maxForeignFee, filteredCards.length]);

    return (
        <div className="cards-page container">
            <div className="cards-page__toolbar">
                <h1 className="cards-page__title">Credit Cards</h1>

                <label className="cards-filter-pill" htmlFor="cards-filter-input">
                    <Search className="cards-filter-pill__icon" size={18} strokeWidth={2} aria-hidden />
                    <input
                        id="cards-filter-input"
                        type="search"
                        enterKeyHint="search"
                        autoComplete="off"
                        aria-label="Filter credit cards by name, bank, or benefit"
                        placeholder="Search name, bank, or benefit…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>

                <select
                    className="cards-page__select"
                    aria-label="Filter by card category"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <input
                    className="cards-page__number-filter"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="Max annual fee ($)"
                    value={maxAnnualFee}
                    onChange={(e) => setMaxAnnualFee(e.target.value)}
                    aria-label="Maximum annual fee"
                />

                <input
                    className="cards-page__number-filter"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="Max interest rate (%)"
                    value={maxInterestRate}
                    onChange={(e) => setMaxInterestRate(e.target.value)}
                    aria-label="Maximum interest rate"
                />

                <input
                    className="cards-page__number-filter"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="Max foreign fee (%)"
                    value={maxForeignFee}
                    onChange={(e) => setMaxForeignFee(e.target.value)}
                    aria-label="Maximum foreign transaction fee"
                />

                {(searchQuery || selectedCategory || maxAnnualFee || maxInterestRate || maxForeignFee) && (
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm cards-page__clear"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                            setMaxAnnualFee('');
                            setMaxInterestRate('');
                            setMaxForeignFee('');
                            setSelectedCompareIds([]);
                            window.history.pushState({}, '', '/cards');
                        }}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {selectedCategory && (
                <p className="cards-page__category">Showing: {selectedCategory}</p>
            )}

            <div className="glass cards-page__grid-wrap">
                {filteredCards.length > 0 ? (
                    <div className="cards-grid">
                        {filteredCards.map(card => (
                            <div key={card.id} className="cards-page__card-item">
                                <Card card={card} />
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm cards-page__compare-btn"
                                    onClick={() => toggleCompareCard(card.id)}
                                >
                                    {selectedCompareIds.includes(card.id) ? 'Remove from compare' : 'Add to compare'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No cards found matching your criteria.</p>
                    </div>
                )}
            </div>

            {compareCards.length > 0 && (
                <section className="glass cards-page__compare-wrap" aria-live="polite">
                    <div className="cards-page__compare-header">
                        <h2>Compare cards</h2>
                        <p>Select up to 4 cards. Add at least 2 for side-by-side comparison.</p>
                    </div>

                    {compareCards.length >= 2 ? (
                        <div className="cards-page__compare-table-wrap">
                            <table className="cards-page__compare-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Field</th>
                                        {compareCards.map((card) => (
                                            <th scope="col" key={card.id}>{card.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Category</th>
                                        {compareCards.map((card) => <td key={card.id}>{card.category}</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">Annual fee</th>
                                        {compareCards.map((card) => <td key={card.id}>${card.fees?.annual ?? 'N/A'}</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">Interest rate</th>
                                        {compareCards.map((card) => <td key={card.id}>{card.interestRate}%</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">Foreign fee</th>
                                        {compareCards.map((card) => <td key={card.id}>{card.fees?.foreign}%</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">Earn rate</th>
                                        {compareCards.map((card) => <td key={card.id}>{card.pointsRate}</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">Best feature</th>
                                        {compareCards.map((card) => <td key={card.id}>{card.feature}</td>)}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="cards-page__compare-hint">Choose one more card to view the comparison table.</p>
                    )}
                </section>
            )}

            <LeadCapture
                sourceContext="cards_listing_footer"
                title="Track fee and bonus updates"
                description="Get notified when annual fees, bonuses, or key card features change."
                compact
            />
        </div>
    );
};

export default CardsPage;
