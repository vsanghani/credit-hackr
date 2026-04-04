import { cardsCore } from './cardsCore.js';
import { extraAuCards } from './extraAuCards.js';

/** Full AU catalog: core + extended issuers. Used for static fallback and DB seeding. */
export const cardsData = [...cardsCore, ...extraAuCards];
