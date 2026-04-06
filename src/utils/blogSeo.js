export const SITE_NAME = 'Credit Hackr';

const DEFAULT_DESCRIPTION =
    'Compare credit cards, maximise rewards, and plan smarter spending with Credit Hackr — guides and tools for Australian card holders.';

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

/**
 * @param {{ title: string, metaDescription: string, excerpt?: string, banner: string, datePublished: string, dateModified?: string, author: string, keywords?: string[] }} post
 * @param {string} path - pathname including /blog/...
 */
export function applyArticleSeo(post, path) {
    const origin = window.location.origin;
    const url = `${origin}${path}`;
    const description = post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION;
    const image = post.banner;
    const modified = post.dateModified || post.datePublished;

    document.title = `${post.title} | ${SITE_NAME}`;

    upsertMeta('name', 'description', description);
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
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        keywords: post.keywords?.join(', ') || undefined,
    };

    setJsonLd('credit-hackr-article-jsonld', jsonLd);
}

export function clearArticleSeo() {
    removeJsonLd('credit-hackr-article-jsonld');
}

/**
 * @param {Array<{ title: string, slug: string, datePublished: string }>} [posts]
 */
export function applyBlogIndexSeo(posts = []) {
    const origin = window.location.origin;
    const url = `${origin}/blog`;
    document.title = `Credit Card Guides & Blog | ${SITE_NAME}`;
    const desc =
        'In-depth Australian credit card guides: frequent flyer points, cashback vs rewards, travel insurance, balance transfers, credit scores, and how to compare cards.';
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', `Credit Card Guides & Blog | ${SITE_NAME}`);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:locale', 'en_AU');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', `Credit Card Guides & Blog | ${SITE_NAME}`);
    upsertMeta('name', 'twitter:description', desc);
    upsertLinkRel('canonical', url);

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
        },
        blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${origin}/blog/${p.slug}`,
            datePublished: p.datePublished,
        })),
    };

    setJsonLd('credit-hackr-blog-index-jsonld', jsonLd);
}

export function clearBlogIndexSeo() {
    removeJsonLd('credit-hackr-blog-index-jsonld');
}

/**
 * @param {{ title: string, description: string, path: string }} page
 */
export function applySimplePageSeo({ title, description, path }) {
    const origin = window.location.origin;
    const url = `${origin}${path}`;
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:locale', 'en_AU');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertLinkRel('canonical', url);
    clearArticleSeo();
    clearBlogIndexSeo();
}

/** Restore head tags when leaving blog routes so other pages are not stuck with article metadata. */
export function resetToSiteDefaults() {
    document.title = SITE_NAME;
    upsertMeta('name', 'description', DEFAULT_DESCRIPTION);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', SITE_NAME);
    upsertMeta('property', 'og:description', DEFAULT_DESCRIPTION);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (origin) {
        upsertMeta('property', 'og:url', `${origin}/`);
        upsertLinkRel('canonical', `${origin}/`);
    }
    clearArticleSeo();
    clearBlogIndexSeo();
}

export { DEFAULT_DESCRIPTION };
