import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import './Dashboard.css';

const Dashboard = () => {
    const [days, setDays] = useState(14);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({ totals: [], byDay: [] });

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`/api/events?days=${days}`, {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal
                });
                if (!res.ok) throw new Error('Unable to fetch analytics summary');
                const payload = await res.json();
                if (!cancelled) setData({ totals: payload.totals || [], byDay: payload.byDay || [] });
            } catch {
                if (!cancelled) setError('Could not load analytics. Check database configuration.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [days]);

    useEffect(() => {
        trackEvent('dashboard_viewed', { days });
    }, [days]);

    const totalEvents = useMemo(
        () => data.totals.reduce((sum, event) => sum + Number(event.count || 0), 0),
        [data.totals]
    );

    return (
        <div className="dashboard-page container">
            <div className="dashboard-header">
                <h1>Analytics Dashboard</h1>
                <label>
                    Window
                    <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                        <option value={7}>Last 7 days</option>
                        <option value={14}>Last 14 days</option>
                        <option value={30}>Last 30 days</option>
                    </select>
                </label>
            </div>

            {loading && <p className="dashboard-muted">Loading analytics...</p>}
            {error && <p className="dashboard-error">{error}</p>}

            {!loading && !error && (
                <>
                    <section className="glass dashboard-stat-grid">
                        <div>
                            <h2>{totalEvents}</h2>
                            <p>Total tracked events</p>
                        </div>
                        <div>
                            <h2>{data.totals.length}</h2>
                            <p>Unique event types</p>
                        </div>
                    </section>

                    <section className="glass dashboard-table-wrap">
                        <h3>Top events</h3>
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.totals.map((event) => (
                                    <tr key={event.event_name}>
                                        <td>{event.event_name}</td>
                                        <td>{event.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="glass dashboard-table-wrap">
                        <h3>Daily volume</h3>
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Events</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.byDay.map((item) => (
                                    <tr key={item.day}>
                                        <td>{item.day}</td>
                                        <td>{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            )}
        </div>
    );
};

export default Dashboard;
