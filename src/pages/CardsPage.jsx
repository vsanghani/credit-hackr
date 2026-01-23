import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../components/Card';
import { cardsData } from '../data/cardsData';
import './Home.css'; // Reusing Home styles for grid

const CardsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Parse query params for category or search
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        if (category) setSelectedCategory(category);
        if (search) setSearchQuery(search);

    }, [location.search]);

    const filteredCards = useMemo(() => {
        return cardsData.filter(card => {
            // Filter by search query
            const matchesSearch =
                card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.feature.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by category if selected
            const matchesCategory = selectedCategory
                ? card.category === selectedCategory
                : true;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="cards-page container">
            <div className="section-header" style={{ marginTop: '2rem' }}>
                <h2>Credit Cards</h2>

                {/* Inline Search for this page */}
                <div className="search-bar glass" style={{ maxWidth: '400px', margin: '0 1rem', padding: '0.5rem 1rem' }}>
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Filter cards..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ fontSize: '1rem' }}
                    />
                </div>

                {(searchQuery || selectedCategory) && (
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                            window.history.pushState({}, '', '/cards');
                        }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {selectedCategory && <h3 style={{ marginBottom: '1rem' }}>Category: {selectedCategory}</h3>}

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
    );
};

export default CardsPage;
