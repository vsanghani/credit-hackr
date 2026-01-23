import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../components/Card';
import { cardsData } from '../data/cardsData';
import './Home.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Parse query params for category filter
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        setSelectedCategory(category);

        // Scroll to results if category is present
        if (category) {
            const element = document.getElementById('card-results');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
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

    // "Popular" section always shows top 3, or top 3 filtered if searching
    const popularCards = searchQuery || selectedCategory ? filteredCards.slice(0, 3) : cardsData.slice(0, 3);
    const showingSearchResults = searchQuery || selectedCategory;

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Find Your Perfect <span className="text-gradient">Aussie Card</span></h1>
                    <p>
                        Compare credit cards, maximize reward points, and hack your way to your next dream holiday.
                    </p>

                    <div className="search-bar glass">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, bank, or benefit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section className="cards-section" id="card-results">
                <div className="container">
                    <div className="section-header">
                        <h2>
                            {showingSearchResults
                                ? `Results for "${selectedCategory || searchQuery || 'All'}"`
                                : 'Most Popular Cards'}
                        </h2>
                        {showingSearchResults && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory(null);
                                    window.history.pushState({}, '', '/');
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {filteredCards.length > 0 ? (
                        <div className="cards-grid">
                            {filteredCards.map(card => (
                                <Card key={card.id} card={card} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No cards found matching your criteria. Try adjusting your search.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
