import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cardsData as staticCards } from '../data/cardsData';

const CardsContext = createContext({
    cards: staticCards,
    loading: true,
    error: null
});

export function CardsProvider({ children }) {
    const [cards, setCards] = useState(() => staticCards);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch('/api/cards', { headers: { Accept: 'application/json' } });
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled && Array.isArray(data) && data.length > 0) {
                        setCards(data);
                        setError(null);
                    }
                }
            } catch {
                /* keep bundled catalog */
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo(() => ({ cards, loading, error }), [cards, loading, error]);

    return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
}

export function useCards() {
    return useContext(CardsContext);
}
