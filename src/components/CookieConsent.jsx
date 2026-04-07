import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import './CookieConsent.css';

const STORAGE_KEY = 'credit-hackr-cookie-consent';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
        } catch {
            setVisible(true);
        }
    }, []);

    const accept = () => {
        try {
            localStorage.setItem(STORAGE_KEY, 'accepted');
        } catch {
            /* ignore */
        }
        trackEvent('cookie_consent_accepted');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-consent" role="dialog" aria-label="Cookie notice">
            <div className="cookie-consent-inner glass">
                <div className="cookie-consent-icon" aria-hidden>
                    <Cookie size={28} />
                </div>
                <div className="cookie-consent-text">
                    <strong>Cookies &amp; privacy</strong>
                    <p>
                        We use essential cookies so the site works, and optional analytics may apply depending on how
                        we configure the deployment. By continuing, you agree to our use of cookies as described in our{' '}
                        <Link to="/privacy">Privacy Policy</Link>.
                    </p>
                </div>
                <button type="button" className="btn btn-primary cookie-consent-btn" onClick={accept}>
                    Accept
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
