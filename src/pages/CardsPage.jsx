import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../components/Card';
import { useCards } from '../context/CardsContext';
import { applyCardsListingSeo, resetToSiteDefaults } from '../utils/seo';
import './Home.css';
import './CardsPage.css';

const CardsPage = () => {
    const { cards } = useCards();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
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

    const filteredCards = useMemo(() => {
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

            return matchesSearch && matchesCategory;
        });
    }, [cards, searchQuery, selectedCategory]);

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

                {(searchQuery || selectedCategory) && (
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm cards-page__clear"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
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
                            <Card key={card.id} card={card} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No cards found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardsPage;
