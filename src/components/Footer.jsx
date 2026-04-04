import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <h3>Credit<span className="logo-accent">Hackr</span></h3>
                    <p>Find your perfect Australian credit card today.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Use</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <a href="#">Support</a>
                        <a href="#">Partnerships</a>
                    </div>
                </div>
                <div className="footer-disclaimer">
                    <p>© 2024 Credit Hackr. All rights reserved. Information provided is for comparison purposes only.</p>
                    <p className="footer-credit">
                        built and managed by{' '}
                        <a
                            href="https://vrtxlabs.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="https://vrtxlabs.tech"
                        >
                            VRTX Labs
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
