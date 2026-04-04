/** Resolve brand styling for generated card artwork (not issuer-provided photography). */

const ISSUER_GRADIENTS = {
    'American Express': ['#2E77BC', '#061E3E'],
    Westpac: ['#D5002B', '#6B0015'],
    NAB: ['#E2231A', '#7A0A12'],
    ANZ: ['#007DBA', '#003C71'],
    CommBank: ['#FFCC29', '#C9A000'],
    Coles: ['#E31837', '#8E0E23'],
    ING: ['#FF6200', '#B34400'],
    'Kogan Money': ['#111111', '#3D3D3D'],
    'Virgin Money': ['#CC0000', '#660000'],
    Bankwest: ['#FF6600', '#993D00'],
    Citi: ['#2563BF', '#0A2A6B'],
    'St.George': ['#00A758', '#004D2E'],
    BankSA: ['#E31837', '#7A0E1E'],
    'Bank of Melbourne': ['#00447C', '#001E38'],
    Suncorp: ['#0097A9', '#004E59'],
    HSBC: ['#DB0011', '#6B0008'],
    'Macquarie Bank': ['#000000', '#2A2A2A'],
    'Bendigo Bank': ['#6E267B', '#3A1444'],
    'Bank of Queensland': ['#00447C', '#002A4D'],
    'ME Bank': ['#FF6600', '#A84300'],
    'Latitude Financial': ['#00A651', '#005C2E'],
    Woolworths: ['#00753D', '#003D20'],
    'Qantas Money': ['#E60000', '#7A0000'],
    Jetstar: ['#FF6600', '#994000'],
    'David Jones': ['#000000', '#262626'],
    'Great Southern Bank': ['#003B7A', '#001A35'],
    Other: ['#334155', '#0F172A']
};

const ISSUER_DEFAULT_NETWORK = {
    'American Express': 'amex',
    CommBank: 'mastercard',
    Westpac: 'mastercard',
    NAB: 'visa',
    ANZ: 'visa',
    Coles: 'mastercard',
    ING: 'mastercard',
    'Kogan Money': 'mastercard',
    'Virgin Money': 'visa',
    Bankwest: 'mastercard',
    Citi: 'mastercard',
    'St.George': 'mastercard',
    BankSA: 'mastercard',
    'Bank of Melbourne': 'mastercard',
    Suncorp: 'mastercard',
    HSBC: 'visa',
    'Macquarie Bank': 'mastercard',
    'Bendigo Bank': 'visa',
    'Bank of Queensland': 'visa',
    'ME Bank': 'mastercard',
    'Latitude Financial': 'mastercard',
    Woolworths: 'mastercard',
    'Qantas Money': 'mastercard',
    Jetstar: 'mastercard',
    'David Jones': 'mastercard',
    'Great Southern Bank': 'visa',
    Other: 'visa'
};

const DARK_TITLE_ISSUERS = new Set(['CommBank']);

export function resolveIssuer(card) {
    if (card.issuer) return card.issuer;
    const n = card.name;
    if (/\bAmex\b|American Express/i.test(n)) return 'American Express';
    if (/Westpac|Altitude|Lite Card|Flex Card/i.test(n)) return 'Westpac';
    if (/NAB|StraightUp/i.test(n)) return 'NAB';
    if (/ANZ/i.test(n)) return 'ANZ';
    if (/CommBank|CBA|\bNeo\b|Ultimate Awards/i.test(n)) return 'CommBank';
    if (/Coles/i.test(n)) return 'Coles';
    if (/ING/i.test(n)) return 'ING';
    if (/Kogan/i.test(n)) return 'Kogan Money';
    if (/Virgin Money/i.test(n)) return 'Virgin Money';
    if (/Bankwest/i.test(n)) return 'Bankwest';
    if (/Citi/i.test(n)) return 'Citi';
    return 'Other';
}

export function resolveNetwork(card) {
    if (card.network) return card.network;
    const n = card.name.toLowerCase();
    if (/\bamex\b|american express/i.test(card.name)) return 'amex';
    if (n.includes('mastercard')) return 'mastercard';
    if (n.includes('david jones') && n.includes('american express')) return 'amex';
    if (n.includes('david jones') && n.includes('mastercard')) return 'mastercard';
    const issuer = resolveIssuer(card);
    return ISSUER_DEFAULT_NETWORK[issuer] || 'visa';
}

export function getCardVisual(card) {
    const issuer = resolveIssuer(card);
    const [c1, c2] = ISSUER_GRADIENTS[issuer] || ISSUER_GRADIENTS.Other;
    return {
        issuer,
        network: resolveNetwork(card),
        c1,
        c2,
        titleTone: DARK_TITLE_ISSUERS.has(issuer) ? 'dark' : 'light'
    };
}

export function shouldUseExternalCardImage(url) {
    return (
        typeof url === 'string' &&
        /^https?:\/\//i.test(url) &&
        !url.includes('placehold.co') &&
        !url.includes('via.placeholder')
    );
}
