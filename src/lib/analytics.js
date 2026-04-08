const CONSENT_KEY = 'credit-hackr-cookie-consent';

function hasConsent() {
    try {
        return localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch {
        return false;
    }
}

export async function trackEvent(eventName, metadata = {}) {
    if (!eventName || !hasConsent()) return;

    try {
        await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                eventName,
                sourcePage: window.location.pathname,
                metadata
            })
        });
    } catch {
        /* ignore analytics failures */
    }
}
