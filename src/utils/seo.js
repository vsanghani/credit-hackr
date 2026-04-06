export const SITE_NAME = 'Credit Hackr';

export const DEFAULT_DESCRIPTION =
    'Compare Australian credit cards, estimate rewards with the HACKR calculator, and read practical guides on points, cashback, perks and responsible card use — general information, not personal advice.';

/** Default social preview image (absolute URL for OG/Twitter). */
export const DEFAULT_OG_IMAGE =
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&h=630&q=80';

const SITE_GRAPH_ID = 'credit-hackr-site-graph';
const PAGE_GRAPH_ID = 'credit-hackr-page-graph';
const ARTICLE_JSONLD_ID = 'credit-hackr-article-jsonld';
const BLOG_INDEX_JSONLD_ID = 'credit-hackr-blog-index-jsonld';

function findMeta(attrName, attrValue) {
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute(attrName) === attrValue) return metas[i];
    }
    return null;
}

function upsertMeta(attrName, attrValue, content) {
    let el = findMeta(attrName, attrValue);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function upsertLinkRel(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function setJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
}

function removeJsonLd(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

export function clearPageGraph() {
    removeJsonLd(PAGE_GRAPH_ID);
}

export function injectSiteGraph() {
    const origin = window.location.origin;
    setJsonLd(SITE_GRAPH_ID, {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${origin}/#organization`,
                name: SITE_NAME,
                url: origin,
                logo: `${origin}/vite.svg`,
                description: DEFAULT_DESCRIPTION,
                areaServed: {
                    '@type': 'Country',
                    name: 'Australia',
                    identifier: 'AU',
                },
            },
            {
                '@type': 'WebSite',
                '@id': `${origin}/#website`,
                name: SITE_NAME,
                url: origin,
                inLanguage: 'en-AU',
                publisher: { '@id': `${origin}/#organization` },
                description: DEFAULT_DESCRIPTION,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${origin}/cards?search={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    });
}

/**
 * Core page SEO: meta tags + optional JSON-LD @graph (WebPage + extras).
 * Clears blog article JSON-LD and previous page graph to avoid duplicate entity conflicts.
 */
export function applyPageSeo({
    title,
    description,
    path,
    keywords = [],
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    webPageExtras = {},
    extraJsonLdNodes = [],
}) {
    removeJsonLd(ARTICLE_JSONLD_ID);
    removeJsonLd(BLOG_INDEX_JSONLD_ID);
    clearPageGraph();

    const origin = window.location.origin;
    const pathOnly = path.split('?')[0];
    const url = `${origin}${pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`}`;
    const fullTitle = `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    if (keywords.length) {
        upsertMeta('name', 'keywords', keywords.join(', '));
    } else {
        const kwEl = findMeta('name', 'keywords');
        if (kwEl) kwEl.remove();
    }
    upsertMeta('name', 'author', SITE_NAME);

    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', 'en_AU');
    upsertMeta('property', 'og:site_name', SITE_NAME);

    upsertMeta('name', 'twitter:card', twitterCard);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertLinkRel('canonical', url);

    const webPage = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: title,
        description,
        url,
        isPartOf: { '@id': `${origin}/#website` },
        publisher: { '@id': `${origin}/#organization` },
        inLanguage: 'en-AU',
        ...webPageExtras,
    };

    const graph = { '@context': 'https://schema.org', '@graph': [webPage, ...extraJsonLdNodes] };
    setJsonLd(PAGE_GRAPH_ID, graph);
}

export function applyHomeSeo() {
    const origin = window.location.origin;
    applyPageSeo({
        title: 'Compare Australian credit cards & rewards',
        description: DEFAULT_DESCRIPTION,
        path: '/',
        keywords: [
            'Australian credit card comparison',
            'credit card rewards Australia',
            'Qantas points card',
            'cashback credit card',
            'frequent flyer credit card',
            'compare credit cards',
        ],
        webPageExtras: {
            about: { '@id': `${origin}/#organization` },
        },
    });
}

export function applyCardsListingSeo() {
    const origin = window.location.origin;
    applyPageSeo({
        title: 'Browse Australian credit cards',
        description:
            'Filter and compare Australian credit cards by category: points, cashback, low fee and travel. See headline bonuses, annual fees, earn rates and benefits — for general comparison only.',
        path: '/cards',
        keywords: [
            'list of credit cards Australia',
            'compare credit cards',
            'rewards credit card',
            'travel credit card Australia',
            'low annual fee card',
        ],
        extraJsonLdNodes: [
            {
                '@type': 'CollectionPage',
                '@id': `${origin}/cards#collection`,
                name: 'Australian credit card directory',
                description:
                    'Educational listing of credit card products with fees, rates and benefits for side-by-side comparison.',
                url: `${origin}/cards`,
                isPartOf: { '@id': `${origin}/#website` },
            },
        ],
    });
}

/**
 * @param {object} card - card from CardsContext / cardsCore
 */
export function applyCardDetailSeo(card) {
    const origin = window.location.origin;
    const path = `/cards/${card.id}`;
    const url = `${origin}${path}`;
    const title = `${card.name} — review fees, earn rate & perks`;
    const description = `${card.description} Key details: ${card.category} card, ${card.pointsRate}, $${card.fees.annual} annual fee, ${card.interestRate}% p.a. purchase rate. General information only — not personal financial advice. Confirm details with the issuer before you apply.`;

    const productId = `${url}#product`;
    const keywords = [
        card.name,
        'Australian credit card',
        card.category,
        'credit card comparison',
        `${card.category} credit card Australia`,
    ];

    const creditCardSchema = {
        '@type': 'CreditCard',
        '@id': productId,
        name: card.name,
        description: card.description,
        annualPercentageRate: card.interestRate,
        feesAndCommissionsSpecification: `Annual fee AUD ${card.fees.annual}; foreign transaction fee ${card.fees.foreign}%`,
        ...(card.applyLink ? { url: card.applyLink } : {}),
    };

    const breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Credit cards', item: `${origin}/cards` },
            { '@type': 'ListItem', position: 3, name: card.name, item: url },
        ],
    };

    applyPageSeo({
        title,
        description,
        path,
        keywords,
        webPageExtras: {
            mainEntity: { '@id': productId },
        },
        extraJsonLdNodes: [creditCardSchema, breadcrumb],
    });
}

export function applyHackrCalculatorSeo() {
    const origin = window.location.origin;
    applyPageSeo({
        title: 'HACKR rewards calculator',
        description:
            'Estimate yearly points or cashback, rough dollar value and net benefit after annual fee for cards in our directory. Educational tool only — your real earn rate depends on spend categories and issuer rules.',
        path: '/hackr',
        keywords: [
            'credit card rewards calculator Australia',
            'points calculator',
            'annual fee vs rewards',
            'is a credit card worth it',
        ],
        extraJsonLdNodes: [
            {
                '@type': 'WebApplication',
                '@id': `${origin}/hackr#app`,
                name: 'HACKR Calculator — Credit Hackr',
                url: `${origin}/hackr`,
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Any',
                browserRequirements: 'Requires JavaScript.',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
                publisher: { '@id': `${origin}/#organization` },
                description:
                    'Interactive calculator to compare estimated yearly rewards against annual fees for Australian credit card profiles.',
            },
        ],
    });
}

export function applyPrivacySeo() {
    applyPageSeo({
        title: 'Privacy Policy',
        description:
            'How Credit Hackr collects, uses and stores personal information in line with the Australian Privacy Act and APPs. Read the full policy for cookies, analytics, third-party links and your rights.',
        path: '/privacy',
        keywords: ['Credit Hackr privacy', 'privacy policy Australia', 'cookies', 'personal information'],
        twitterCard: 'summary',
    });
}

export function applyTermsSeo() {
    applyPageSeo({
        title: 'Terms of Use',
        description:
            'Terms governing use of the Credit Hackr website: not personal financial product advice, limitation of liability, acceptable use and links to the Privacy Policy.',
        path: '/terms',
        keywords: ['Credit Hackr terms', 'terms of use', 'disclaimer', 'general information'],
        twitterCard: 'summary',
    });
}

/**
 * @param {{ title: string, metaDescription: string, excerpt?: string, banner: string, datePublished: string, dateModified?: string, author: string, keywords?: string[] }} post
 * @param {string} path - pathname including /blog/...
 */
export function applyArticleSeo(post, path) {
    clearPageGraph();
    removeJsonLd(BLOG_INDEX_JSONLD_ID);

    const origin = window.location.origin;
    const url = `${origin}${path}`;
    const description = post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION;
    const image = post.banner;
    const modified = post.dateModified || post.datePublished;

    document.title = `${post.title} | ${SITE_NAME}`;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'author', post.author);
    upsertMeta('property', 'og:type', 'article');
    upsertMeta('property', 'og:title', post.title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:locale', 'en_AU');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', post.title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    if (post.keywords?.length) {
        upsertMeta('name', 'keywords', post.keywords.join(', '));
    } else {
        const kwEl = findMeta('name', 'keywords');
        if (kwEl) kwEl.remove();
    }

    upsertLinkRel('canonical', url);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description,
        image: [image],
        datePublished: post.datePublished,
        dateModified: modified,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: origin,
            '@id': `${origin}/#organization`,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        keywords: post.keywords?.join(', ') || undefined,
    };

    setJsonLd(ARTICLE_JSONLD_ID, jsonLd);
}

export function clearArticleSeo() {
    removeJsonLd(ARTICLE_JSONLD_ID);
}

/**
 * @param {Array<{ title: string, slug: string, datePublished: string }>} [posts]
 */
export function applyBlogIndexSeo(posts = []) {
    clearPageGraph();
    removeJsonLd(ARTICLE_JSONLD_ID);

    const origin = window.location.origin;
    const url = `${origin}/blog`;
    document.title = `Credit Card Guides & Blog | ${SITE_NAME}`;
    const desc =
        'In-depth Australian credit card guides: frequent flyer points, cashback vs rewards, travel insurance, balance transfers, credit scores, and how to compare cards.';
    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'author', SITE_NAME);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', `Credit Card Guides & Blog | ${SITE_NAME}`);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
    upsertMeta('property', 'og:locale', 'en_AU');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', `Credit Card Guides & Blog | ${SITE_NAME}`);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);
    upsertLinkRel('canonical', url);
    upsertMeta(
        'name',
        'keywords',
        [
            'credit card blog Australia',
            'Qantas Points guide',
            'credit score Australia',
            'balance transfer',
            'travel insurance credit card',
        ].join(', ')
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `Credit Card Guides & Blog — ${SITE_NAME}`,
        description: desc,
        url,
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: origin,
            '@id': `${origin}/#organization`,
        },
        blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${origin}/blog/${p.slug}`,
            datePublished: p.datePublished,
        })),
    };

    setJsonLd(BLOG_INDEX_JSONLD_ID, jsonLd);
}

export function clearBlogIndexSeo() {
    removeJsonLd(BLOG_INDEX_JSONLD_ID);
}

/**
 * @param {{ title: string, description: string, path: string, keywords?: string[] }} page
 */
export function applySimplePageSeo({ title, description, path, keywords = [] }) {
    applyPageSeo({
        title,
        description,
        path,
        keywords,
        twitterCard: 'summary',
    });
}

/** Restore head tags when leaving a routed page so defaults apply until the next screen sets them. */
export function resetToSiteDefaults() {
    document.title = SITE_NAME;
    upsertMeta('name', 'description', DEFAULT_DESCRIPTION);
    const kwReset = findMeta('name', 'keywords');
    if (kwReset) kwReset.remove();
    upsertMeta('name', 'author', SITE_NAME);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', `${SITE_NAME} — Compare credit cards & maximise rewards`);
    upsertMeta('property', 'og:description', DEFAULT_DESCRIPTION);
    upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
    upsertMeta('property', 'og:locale', 'en_AU');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', `${SITE_NAME} — Compare credit cards & maximise rewards`);
    upsertMeta('name', 'twitter:description', DEFAULT_DESCRIPTION);
    upsertMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (origin) {
        upsertMeta('property', 'og:url', `${origin}/`);
        upsertLinkRel('canonical', `${origin}/`);
    }

    clearArticleSeo();
    clearBlogIndexSeo();
    clearPageGraph();
}
