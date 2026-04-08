import { neon } from '@neondatabase/serverless';
import { cardsData as staticCards } from '../src/data/cardsData.js';

function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function normaliseCards(rows) {
    return rows.map((row) => {
        const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        return { ...data, id: row.id };
    });
}

function includesTravelBenefit(card) {
    const haystack = `${card.feature || ''} ${(card.benefits || []).join(' ')}`.toLowerCase();
    return ['travel', 'lounge', 'qantas', 'velocity', 'flight', 'hotel', 'insurance'].some((k) =>
        haystack.includes(k)
    );
}

function annualFeeLimit(tolerance) {
    if (tolerance === 'low') return 100;
    if (tolerance === 'medium') return 300;
    return 9999;
}

function scoreCard(card, profile) {
    const monthlySpend = Math.max(0, toNumber(profile.monthlySpend, 0));
    const yearlyValue = monthlySpend * 12 * toNumber(card.earnRate, 0) * toNumber(card.pointValue, 0);
    const annualFee = toNumber(card?.fees?.annual, 0);
    const foreignFee = toNumber(card?.fees?.foreign, 0);
    const interestRate = toNumber(card?.interestRate, 99);
    const feeToleranceLimit = annualFeeLimit(profile.annualFeeTolerance);

    let score = 0;
    const reasons = [];

    const net = yearlyValue - annualFee;
    score += Math.max(-30, Math.min(35, net / 12));
    if (net > 0) reasons.push(`Estimated positive net value around $${net.toFixed(0)}/year.`);

    if (profile.rewardsPreference === 'cashback') {
        if (card.category === 'Cashback') {
            score += 14;
            reasons.push('Matches your cashback preference.');
        } else if (card.category === 'Points') {
            score -= 4;
        }
    }

    if (profile.rewardsPreference === 'points') {
        if (card.category === 'Points') {
            score += 14;
            reasons.push('Matches your points preference.');
        } else if (card.category === 'Cashback') {
            score -= 3;
        }
    }

    if (profile.wantsTravelPerks && includesTravelBenefit(card)) {
        score += 10;
        reasons.push('Includes travel-oriented perks.');
    }

    if (profile.foreignFeeSensitive) {
        score += Math.max(0, 8 - foreignFee * 2);
        if (foreignFee === 0) reasons.push('No foreign transaction fee.');
    }

    if (profile.carriesBalance) {
        const interestBonus = Math.max(0, 20 - interestRate);
        score += interestBonus;
        if (interestRate <= 14) reasons.push('Lower purchase interest rate for carried balances.');
    } else {
        score += Math.max(0, toNumber(card.earnRate, 0) * 1.5);
    }

    if (annualFee <= feeToleranceLimit) {
        score += 8;
        reasons.push('Annual fee sits within your tolerance.');
    } else {
        score -= Math.min(16, (annualFee - feeToleranceLimit) / 25);
    }

    return {
        ...card,
        score: Number(score.toFixed(2)),
        rationale: reasons.slice(0, 3)
    };
}

async function loadCards() {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) return staticCards;

    try {
        const sql = neon(databaseUrl);
        const rows = await sql`SELECT id, data FROM cards ORDER BY id ASC`;
        const dbCards = normaliseCards(rows);
        return dbCards.length ? dbCards : staticCards;
    } catch (e) {
        console.error('[api/recommendations:loadCards]', e);
        return staticCards;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const profile = {
        monthlySpend: toNumber(body.monthlySpend, 0),
        rewardsPreference: body.rewardsPreference || 'either',
        annualFeeTolerance: body.annualFeeTolerance || 'medium',
        wantsTravelPerks: Boolean(body.wantsTravelPerks),
        foreignFeeSensitive: Boolean(body.foreignFeeSensitive),
        carriesBalance: Boolean(body.carriesBalance)
    };

    const cards = await loadCards();
    const ranked = cards
        .map((card) => scoreCard(card, profile))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ profile, recommendations: ranked });
}
