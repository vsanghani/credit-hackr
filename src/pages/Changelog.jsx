import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { applySimplePageSeo, resetToSiteDefaults } from '../utils/blogSeo';
import { parseChangelog } from '../utils/parseChangelog';
import changelogSource from '../../CHANGELOG.md?raw';
import './Changelog.css';

function formatInlineMd(text) {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const Changelog = () => {
    const { preamble, releases } = useMemo(() => parseChangelog(changelogSource), []);

    useEffect(() => {
        applySimplePageSeo({
            title: 'Changelog',
            description:
                'Credit Hackr product changelog: new features, blog and SEO updates, and notable changes over time.',
            path: '/changelog',
        });
        return () => resetToSiteDefaults();
    }, []);

    return (
        <div className="changelog-page">
            <div className="container">
                <div className="changelog-header">
                    <h1>
                        <span className="text-gradient">Changelog</span>
                    </h1>
                    <p className="changelog-lead">
                        What is new on Credit Hackr. The same history lives in the repo as{' '}
                        <code className="changelog-code">CHANGELOG.md</code>—update that file as you ship.
                    </p>
                </div>

                <div className="changelog-body glass">
                    {preamble ? (
                        <div className="changelog-preamble">
                            {preamble.split(/\n\n+/).map((block, idx) => (
                                <p
                                    key={idx}
                                    dangerouslySetInnerHTML={{ __html: formatInlineMd(block) }}
                                />
                            ))}
                        </div>
                    ) : null}

                    <div className="changelog-versions">
                        {releases.map((release) => (
                            <section key={release.version} className="changelog-release">
                                <div className="changelog-release-heading">
                                    <h2 className="changelog-version">{release.version}</h2>
                                    {release.date ? (
                                        <time className="changelog-date" dateTime={release.date}>
                                            {release.date}
                                        </time>
                                    ) : null}
                                </div>
                                {release.sections.map((section) =>
                                    section.items.length ? (
                                        <div key={section.title} className="changelog-section">
                                            <h3>{section.title}</h3>
                                            <ul>
                                                {section.items.map((item, j) => (
                                                    <li
                                                        key={j}
                                                        dangerouslySetInnerHTML={{
                                                            __html: formatInlineMd(item),
                                                        }}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null
                                )}
                            </section>
                        ))}
                    </div>
                </div>

                <p className="changelog-back">
                    <Link to="/">&larr; Back to home</Link>
                </p>
            </div>
        </div>
    );
};

export default Changelog;
