import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CreditCard, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCardsDropdownOpen, setIsCardsDropdownOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleCardsDropdown = () => setIsCardsDropdownOpen(!isCardsDropdownOpen);

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    Credit<span className="logo-accent">Hackr</span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>

                    <Link to="/blog" className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
                        Blog
                    </Link>

                    <div className="nav-dropdown-container">
                        <button
                            className="nav-link dropdown-trigger"
                            onClick={toggleCardsDropdown}
                        >
                            Cards <ChevronDown size={16} />
                        </button>
                        {isCardsDropdownOpen && (
                            <div className="dropdown-menu glass">
                                <Link to="/cards?category=Points" className="dropdown-item" onClick={() => setIsCardsDropdownOpen(false)}>
                                    Points Cards
                                </Link>
                                <Link to="/cards?category=Cashback" className="dropdown-item" onClick={() => setIsCardsDropdownOpen(false)}>
                                    Cashback
                                </Link>
                                <Link to="/cards?category=Low Interest" className="dropdown-item" onClick={() => setIsCardsDropdownOpen(false)}>
                                    Low Interest
                                </Link>
                                <Link to="/cards" className="dropdown-item" onClick={() => setIsCardsDropdownOpen(false)}>
                                    All Cards
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/hackr" className="btn btn-primary nav-btn">
                        HACKR
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="mobile-menu glass">
                    <Link to="/" className="mobile-link" onClick={toggleMenu}>
                        Home
                    </Link>
                    <Link to="/blog" className="mobile-link" onClick={toggleMenu}>
                        Blog
                    </Link>
                    <div className="mobile-section">
                        <span className="mobile-section-title">Cards</span>
                        <Link to="/cards?category=Points" className="mobile-sublink" onClick={toggleMenu}>Points</Link>
                        <Link to="/cards?category=Cashback" className="mobile-sublink" onClick={toggleMenu}>Cashback</Link>
                        <Link to="/cards?category=Low Interest" className="mobile-sublink" onClick={toggleMenu}>Low Interest</Link>
                    </div>
                    <Link to="/hackr" className="btn btn-primary mobile-btn" onClick={toggleMenu}>
                        HACKR
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
