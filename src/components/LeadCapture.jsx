import { useEffect, useState } from 'react';
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
    const [captchaRequired, setCaptchaRequired] = useState(false);
    const [captchaProvider, setCaptchaProvider] = useState('');
    const [captchaSiteKey, setCaptchaSiteKey] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    useEffect(() => {
        window.onLeadCaptchaSolved = (token) => setCaptchaToken(token);
        return () => {
            if (window.onLeadCaptchaSolved) delete window.onLeadCaptchaSolved;
        };
    }, []);

    useEffect(() => {
        if (!captchaRequired || !captchaSiteKey) return;

        const ensureScript = (src) => {
            if (document.querySelector(`script[src="${src}"]`)) return;
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        };

        if (captchaProvider === 'turnstile') {
            ensureScript('https://challenges.cloudflare.com/turnstile/v0/api.js');
        } else if (captchaProvider === 'hcaptcha') {
            ensureScript('https://js.hcaptcha.com/1/api.js');
        }
    }, [captchaRequired, captchaProvider, captchaSiteKey]);

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
                    sourceContext,
                    // Honeypot field: should stay empty for real users.
                    company: '',
                    captchaToken
                })
            });

            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 403 && payload.captchaRequired) {
                    setCaptchaRequired(true);
                    setCaptchaProvider(payload.captchaProvider || '');
                    setCaptchaSiteKey(payload.captchaSiteKey || '');
                    setMessage('Please complete the CAPTCHA challenge.');
                    setStatus('error');
                    return;
                }
                throw new Error('Unable to subscribe');
            }

            setStatus('success');
            setMessage('Check your inbox to verify your email and complete subscription.');
            setEmail('');
            setCaptchaToken('');
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
            {captchaRequired && (
                <div className="lead-capture__captcha">
                    <p className="lead-capture__captcha-note">
                        CAPTCHA required due to unusual traffic. Complete the challenge, then submit again.
                    </p>
                    {captchaProvider === 'turnstile' && captchaSiteKey ? (
                        <div
                            className="cf-turnstile"
                            data-sitekey={captchaSiteKey}
                            data-callback="onLeadCaptchaSolved"
                        ></div>
                    ) : null}
                    {captchaProvider === 'hcaptcha' && captchaSiteKey ? (
                        <div
                            className="h-captcha"
                            data-sitekey={captchaSiteKey}
                            data-callback="onLeadCaptchaSolved"
                        ></div>
                    ) : null}
                    {!captchaSiteKey ? (
                        <input
                            type="text"
                            value={captchaToken}
                            onChange={(e) => setCaptchaToken(e.target.value)}
                            placeholder="Paste CAPTCHA token"
                            aria-label="CAPTCHA token"
                        />
                    ) : null}
                </div>
            )}
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
