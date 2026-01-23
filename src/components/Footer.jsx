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
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Use</a>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <a href="#">Support</a>
                        <a href="#">Partnerships</a>
                    </div>
                </div>
                <div className="footer-disclaimer">
                    <p>© 2024 Credit Hackr. All rights reserved. Information provided is for comparison purposes only.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
