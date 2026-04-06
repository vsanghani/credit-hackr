/**
 * Parse a Keep a Changelog–style document into structured data for rendering.
 * Expects `## [version] - YYYY-MM-DD` or `## [Unreleased]` headings and `### Section` with `- item` lines.
 */
export function parseChangelog(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    let i = 0;

    while (i < lines.length && !lines[i].startsWith('## ')) {
        i += 1;
    }

    const preambleLines = lines.slice(0, i).filter((line, idx) => {
        if (idx === 0 && line.startsWith('# ')) return false;
        return line.trim() !== '';
    });
    const preamble = preambleLines.join('\n').trim();

    const releases = [];
    while (i < lines.length) {
        const line = lines[i];
        if (!line.startsWith('## ')) {
            i += 1;
            continue;
        }

        const header = line.slice(3).trim();
        let version;
        let date = null;

        if (header.startsWith('[Unreleased]')) {
            version = 'Unreleased';
            const rest = header.slice('[Unreleased]'.length).trim();
            const dm = rest.match(/^-\s*(\d{4}-\d{2}-\d{2})\s*$/);
            if (dm) date = dm[1];
        } else {
            const m = header.match(/^\[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})\s*$/);
            if (m) {
                version = m[1];
                date = m[2];
            } else {
                version = header;
            }
        }

        i += 1;
        const sections = [];
        let current = null;

        while (i < lines.length && !lines[i].startsWith('## ')) {
            const row = lines[i];
            if (row.startsWith('### ')) {
                current = { title: row.slice(4).trim(), items: [] };
                sections.push(current);
            } else if (row.trim().startsWith('- ') && current) {
                current.items.push(row.trim().slice(2).trim());
            }
            i += 1;
        }

        releases.push({ version, date, sections });
    }

    return { preamble, releases };
}
