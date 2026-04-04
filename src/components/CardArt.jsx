import { useId } from 'react';
import { siAmericanexpress, siMastercard, siVisa } from 'simple-icons';
import { getCardVisual, shouldUseExternalCardImage } from '../lib/cardVisual';
import './CardArt.css';

const NETWORK = {
    visa: siVisa,
    mastercard: siMastercard,
    amex: siAmericanexpress
};

function truncateLabel(name, max = 42) {
    if (name.length <= max) return name;
    return `${name.slice(0, max - 1)}…`;
}

/**
 * Photoreal-style card graphic (brand-coloured art, not bank product photography).
 * Use `card.image` only when `shouldUseExternalCardImage` is true.
 */
const CardArt = ({ card, variant = 'grid', className = '', decorative = false }) => {
    const uid = useId().replace(/:/g, '');

    if (shouldUseExternalCardImage(card.image)) {
        return (
            <img
                src={card.image}
                alt={card.name}
                className={`card-art-photo ${className}`.trim()}
                decoding="async"
            />
        );
    }

    const { c1, c2, network, titleTone, issuer: brandIssuer } = getCardVisual(card);
    const icon = NETWORK[network] || NETWORK.visa;
    const gid = `cg-${card.id}-${uid}`;
    const label = truncateLabel(card.name);

    const networkFill =
        network === 'mastercard'
            ? titleTone === 'dark'
                ? '#1a1a1a'
                : '#ffffff'
            : titleTone === 'dark'
              ? '#1a1a1a'
              : '#ffffff';

    return (
        <svg
            className={`card-art ${variant === 'detail' ? 'card-art--detail' : ''} ${className}`.trim()}
            viewBox="0 0 400 252"
            role={decorative ? 'presentation' : 'img'}
            aria-hidden={decorative ? true : undefined}
            aria-label={decorative ? undefined : card.name}
        >
            {!decorative ? <title>{card.name}</title> : null}
            <defs>
                <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={c1} />
                    <stop offset="100%" stopColor={c2} />
                </linearGradient>
                <linearGradient id={`${gid}-chip`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F2D38A" />
                    <stop offset="50%" stopColor="#C9A227" />
                    <stop offset="100%" stopColor="#8B6914" />
                </linearGradient>
                <pattern id={`${gid}-grain`} width="100" height="100" patternUnits="userSpaceOnUse">
                    <circle cx="25" cy="25" r="1" fill="#ffffff" opacity="0.06" />
                    <circle cx="75" cy="80" r="0.8" fill="#ffffff" opacity="0.05" />
                    <circle cx="50" cy="10" r="0.6" fill="#ffffff" opacity="0.04" />
                </pattern>
            </defs>

            <rect width="400" height="252" rx="20" fill={`url(#${gid})`} />
            <rect width="400" height="252" rx="20" fill={`url(#${gid}-grain)`} />

            <g opacity="0.14" stroke={titleTone === 'dark' ? '#000' : '#fff'} fill="none" strokeWidth="1">
                <path d="M-20 180 Q 200 120 420 200" />
                <path d="M-20 200 Q 200 140 420 220" />
            </g>

            <rect x="36" y="100" width="52" height="42" rx="6" fill={`url(#${gid}-chip)`} />
            <rect x="40" y="104" width="44" height="34" rx="4" fill="#000000" opacity="0.12" />

            <g
                transform="translate(100, 108)"
                stroke={titleTone === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)'}
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
            >
                <path d="M 0 16 A 14 14 0 0 1 28 16" />
                <path d="M 6 16 A 14 14 0 0 1 34 16" />
                <path d="M 12 16 A 14 14 0 0 1 40 16" />
            </g>

            <text
                x="36"
                y="54"
                fill={titleTone === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)'}
                fontSize="15"
                fontWeight="700"
                fontFamily="system-ui, Inter, sans-serif"
                letterSpacing="0.04em"
            >
                {card.issuer || brandIssuer}
            </text>

            <text
                x="36"
                y="200"
                fill={titleTone === 'dark' ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.92)'}
                fontSize="17"
                fontWeight="600"
                fontFamily="system-ui, Inter, sans-serif"
            >
                {label}
            </text>

            <g transform="translate(308, 188) scale(2.35)" fill={networkFill}>
                <path d={icon.path} />
            </g>
        </svg>
    );
};

export default CardArt;
