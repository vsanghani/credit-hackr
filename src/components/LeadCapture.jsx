import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';
import './LeadCapture.css';

const LeadCapture = ({
    sourceContext = 'site',
    title = 'Get the best card deals in your inbox',
    description = 'Weekly picks, fee changes, and reward opportunities. No spam.',
    compact = false
}) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        const normalized = email.trim().toLowerCase();
        if (!normalized) return;

        setStatus('loading');
        setMessage('');
        trackEvent('lead_capture_submitted', { sourceContext });

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    email: normalized,
                    sourcePage: window.location.pathname,
                    sourceContext
                })
            });

            if (!res.ok) throw new Error('Unable to subscribe');

            setStatus('success');
            setMessage('Thanks, you are subscribed.');
            setEmail('');
            trackEvent('lead_capture_success', { sourceContext });
        } catch {
            setStatus('error');
            setMessage('Could not subscribe right now. Please try again.');
            trackEvent('lead_capture_failed', { sourceContext });
        }
    };

    return (
        <section className={`lead-capture glass ${compact ? 'lead-capture--compact' : ''}`} aria-label="Email signup">
            <div className="lead-capture__copy">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <form className="lead-capture__form" onSubmit={submit}>
                <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    aria-label="Email address"
                />
                <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Joining...' : 'Join free'}
                </button>
            </form>
            <p className="lead-capture__legal">
                By subscribing, you agree to our <Link to="/privacy">Privacy Policy</Link>.
            </p>
            {message && (
                <p className={`lead-capture__status ${status === 'error' ? 'is-error' : 'is-success'}`}>{message}</p>
            )}
        </section>
    );
};

export default LeadCapture;
