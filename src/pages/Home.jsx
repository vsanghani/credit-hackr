import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Check } from 'lucide-react';
import Card from '../components/Card';
import { cardsData } from '../data/cardsData';
import './Home.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/cards?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Get top 3 cards for "Popular Cards" section
    const popularCards = cardsData.slice(0, 3);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>Find Your Perfect <span className="text-gradient">Aussie Card</span></h1>
                    <p>
                        Compare credit cards, maximize reward points, and hack your way to your next dream holiday.
                    </p>

                    <form onSubmit={handleSearch} className="search-bar glass huge-search">
                        <Search className="search-icon" size={24} />
                        <input
                            type="text"
                            placeholder="Search by name, bank, or benefit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary search-btn">Search</button>
                    </form>
                </div>
            </section>

            {/* Popular Cards Section - Restored */}
            <section className="popular-section container">
                <div className="section-header">
                    <h2>Most Popular Cards</h2>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/cards')}>
                        View All Cards <ChevronRight size={16} />
                    </button>
                </div>

                <div className="cards-grid">
                    {popularCards.map(card => (
                        <div key={card.id} className="card-wrapper">
                            {/* Reuse Card component but ensuring we can add extra info if needed */}
                            <Card card={card} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
