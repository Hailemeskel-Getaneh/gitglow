/**
 * Premium SVG Rendering Engine for GitGlow
 */

// ─── THEME REGISTRY ───────────────────────────────────────────────────────────
const THEMES = {
    dark: {
        bg: '#0d1117', bg2: '#161b22',
        text: '#c9d1d9', accent: '#58a6ff',
        border: '#30363d', icon: '#8b949e'
    },
    midnight: {
        bg: '#000000', bg2: '#0a0a0a',
        text: '#ffffff', accent: '#ff00ff',
        border: '#111111', icon: '#ff00ff'
    },
    glow: {
        bg: '#0d1117', bg2: '#161b22',
        text: '#e6edf3', accent: '#7ee787',
        border: '#30363d', icon: '#7ee787'
    },
    radical: {
        bg: '#141321', bg2: '#1a1832',
        text: '#a9fef7', accent: '#fe428e',
        border: '#fe428e', icon: '#f8d847'
    },
    tokyonight: {
        bg: '#1a1b27', bg2: '#24283b',
        text: '#a9b1d6', accent: '#70a5fd',
        border: '#414868', icon: '#bf91f3'
    },
    dracula: {
        bg: '#282a36', bg2: '#1e1f29',
        text: '#f8f8f2', accent: '#ff79c6',
        border: '#6272a4', icon: '#bd93f9'
    },
    ocean: {
        bg: '#1b2a3b', bg2: '#0f1e2d',
        text: '#cdd9e5', accent: '#39d0d8',
        border: '#264562', icon: '#6cb6ff'
    },
    solarized: {
        bg: '#002b36', bg2: '#073642',
        text: '#839496', accent: '#2aa198',
        border: '#073642', icon: '#268bd2'
    }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getTheme(options = {}) {
    const base = THEMES[options.theme] || THEMES.dark;
    return {
        ...base,
        accent:  options.title_color ? `#${options.title_color.replace('#', '')}` : base.accent,
        text:    options.text_color  ? `#${options.text_color.replace('#', '')}`  : base.text,
        icon:    options.icon_color  ? `#${options.icon_color.replace('#', '')}`  : base.icon,
        bg:      options.bg_color    ? `#${options.bg_color.replace('#', '')}`    : base.bg,
        bg2:     options.bg_color    ? `#${options.bg_color.replace('#', '')}`    : (base.bg2 || base.bg),
    };
}

function commonDefs(theme) {
    return `
        <defs>
            <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${theme.bg}" />
                <stop offset="100%" stop-color="${theme.bg2}" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="4" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>`;
}

function commonStyles(theme) {
    return `
        <style>
            .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .stat   { font: 600 28px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .value  { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .label  { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .small  { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .stagger { animation: fadeIn 0.5s ease-in-out forwards; opacity: 0; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        </style>`;
}

// ─── ERROR CARD ───────────────────────────────────────────────────────────────
function renderErrorCard(message = 'Something went wrong') {
    const theme = THEMES.dark;
    const safe = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
    <svg width="495" height="120" viewBox="0 0 495 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            .err-title { font: 600 17px 'Segoe UI', Ubuntu, Sans-Serif; fill: #f85149; }
            .err-msg   { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: #8b949e; }
        </style>
        <rect x="0.5" y="0.5" width="494" height="119" rx="12" fill="${theme.bg}" stroke="#f85149" stroke-opacity="0.6" />
        <svg x="22" y="30" width="22" height="22" viewBox="0 0 16 16">
            <path fill="#f85149" fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" />
        </svg>
        <text x="52" y="46" class="err-title">GitGlow Error</text>
        <text x="22" y="80" class="err-msg">${safe}</text>
        <text x="22" y="102" class="err-msg" fill="#6e7681">Check your username or try again later.</text>
    </svg>`;
}

// ─── STATS CARD ───────────────────────────────────────────────────────────────
function renderStatsCard(stats, options = {}) {
    const theme = getTheme(options);
    const hideBorder = options.hide_border === 'true';
    const hidden = (options.hide || '').split(',').map(s => s.trim());

    const allStats = [
        { key: 'stars', label: 'Total Stars', value: stats.stars, icon: 'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z' },
        { key: 'commits', label: 'Total Commits', value: stats.commits, icon: 'M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z' },
        { key: 'prs', label: 'Total PRs', value: stats.prs, icon: 'M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25z' },
        { key: 'issues', label: 'Total Issues', value: stats.issues, icon: 'M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z' },
        { key: 'contributedRepo', label: 'Contributed To', value: stats.contributedRepo, icon: 'M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9z' },
        { key: 'followers', label: 'Followers', value: stats.followers, icon: 'M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5z' },
    ].filter(s => !hidden.includes(s.key));

    let cells = '';
    allStats.forEach((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col === 0 ? 0 : 230;
        const y = row * 50;
        const delay = 0.2 + i * 0.1;
        cells += `
        <g transform="translate(${x}, ${y})">
            <g class="stagger" style="animation-delay: ${delay}s">
                <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="${theme.icon}" fill-rule="evenodd" d="${s.icon}"/>
                </svg>
                <text x="36" y="25" class="label">${s.label}</text>
                <text x="200" y="25" text-anchor="end" class="value">${s.value}</text>
            </g>
        </g>`;
    });

    const rows = Math.ceil(allStats.length / 2);
    const cardH = 35 + 40 + rows * 50 + 15;

    return `
    <svg width="495" height="${cardH}" viewBox="0 0 495 ${cardH}" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${commonStyles(theme)}
        ${commonDefs(theme)}
        <rect x="0.5" y="0.5" width="494" height="${cardH - 1}" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />
        <g transform="translate(25, 35)">
            <g class="stagger" style="animation-delay: 0.1s">
                <text x="0" y="0" class="header">${stats.name}'s GitHub Stats</text>
            </g>
            <g transform="translate(0, 40)">
                ${cells}
            </g>
        </g>
    </svg>`;
}

// ─── LANGUAGES CARD ───────────────────────────────────────────────────────────
function renderLanguagesCard(languages, options = {}) {
    const theme = getTheme(options);
    const hideBorder = options.hide_border === 'true';

    let bars = '';
    let labels = '';
    let currentX = 0;

    languages.forEach((lang, i) => {
        const width = (lang.percentage / 100) * 445;
        bars += `<rect x="${currentX}" y="0" width="${width}" height="8" fill="${lang.color || '#ccc'}" rx="4" />`;
        currentX += width;
        if (i < 6) {
            labels += `
            <g transform="translate(${i % 2 === 0 ? 0 : 220}, ${Math.floor(i / 2) * 25})">
                <circle cx="5" cy="-4" r="5" fill="${lang.color || '#ccc'}" />
                <text x="17" y="0" class="small">${lang.name} ${lang.percentage.toFixed(1)}%</text>
            </g>`;
        }
    });

    return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${commonStyles(theme)}
        ${commonDefs(theme)}
        <rect x="0.5" y="0.5" width="494" height="194" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />
        <g transform="translate(25, 35)">
            <g class="stagger">
                <text x="0" y="0" class="header">Most Used Languages</text>
            </g>
            <g transform="translate(0, 30)">
                <g class="stagger" style="animation-delay: 0.2s">
                    <mask id="rect-mask"><rect x="0" y="0" width="445" height="10" rx="5" fill="white" /></mask>
                    <g mask="url(#rect-mask)">${bars}</g>
                </g>
            </g>
            <g transform="translate(0, 65)"><g class="stagger" style="animation-delay: 0.4s">${labels}</g></g>
        </g>
    </svg>`;
}

// ─── STREAK CARD ──────────────────────────────────────────────────────────────
function renderStreakCard(streak, options = {}) {
    const theme = getTheme(options);
    const hideBorder = options.hide_border === 'true';

    // Animated stroke-dashoffset for the ring
    const circumference = 2 * Math.PI * 38; // r=38
    const filledArc = circumference * 0.75; // 75% full
    const gap = circumference - filledArc;

    return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${commonStyles(theme)}
        <style>
            @keyframes ringIn {
                from { stroke-dashoffset: ${circumference.toFixed(1)}; opacity: 0; }
                to   { stroke-dashoffset: ${(circumference - filledArc).toFixed(1)}; opacity: 1; }
            }
            .ring-animated {
                animation: ringIn 1.2s ease-out forwards;
                stroke-dasharray: ${filledArc.toFixed(1)} ${gap.toFixed(1)};
                stroke-dashoffset: ${circumference.toFixed(1)};
            }
            .date-range { font: 400 11px 'Segoe UI', Sans-Serif; fill: ${theme.accent}; opacity: 0.8; }
            .separator { stroke: ${theme.text}; stroke-opacity: 0.2; stroke-width: 1; }
        </style>
        ${commonDefs(theme)}
        <rect x="0.5" y="0.5" width="494" height="194" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />

        <g transform="translate(25, 20)">
            <!-- Left Column: Total Contributions -->
            <g class="stagger" style="animation-delay: 0.2s">
                <text x="74" y="90" text-anchor="middle" class="stat" style="font-size: 32px; fill: ${theme.accent};">${streak.total}</text>
                <text x="74" y="115" text-anchor="middle" class="label" style="font-size: 14px; font-weight: 500;">Total Contributions</text>
                <text x="74" y="135" text-anchor="middle" class="date-range">${streak.totalRange}</text>
            </g>

            <!-- Separators -->
            <line x1="148" y1="40" x2="148" y2="135" class="separator" />
            <line x1="296" y1="40" x2="296" y2="135" class="separator" />

            <!-- Middle Column: Current Streak -->
            <g class="stagger" style="animation-delay: 0.3s">
                <!-- Flame Icon centered at x=222, sitting on top of circle (cy=80, r=38) -->
                <svg x="213" y="18" width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#fb8c00" d="M17.66 11.2c-.23-.3-.51-.56-.8-.82-1.2-1.08-1.69-2.65-1.33-4.24.09-.39.13-.8.13-1.21 0-1.1-.31-2.09-.84-2.93-.08-.13-.28-.11-.33.04-.5 1.49-1.32 2.76-2.54 3.6-1.5 1.03-2.63 2.5-3.1 4.24-.4 1.46-.18 2.97.59 4.23.53.87 1.25 1.58 2.09 2.09 1.2.72 2.57 1.07 3.93 1.03 1.43-.05 2.82-.57 3.93-1.5 1.34-1.12 2.02-2.83 1.83-4.59-.06-.5-.18-.99-.36-1.47-.05-.15-.24-.18-.34-.07-.38.41-.83.76-1.31 1.03-.43.23-.97.43-1.46.33-.2-.04-.32-.22-.3-.41.05-.59.23-1.16.51-1.68.21-.39.49-.75.82-1.07.1-.1.08-.28-.04-.35z"/>
                </svg>

                <circle cx="222" cy="80" r="38" fill="none" stroke="${theme.text}" stroke-opacity="0.08" stroke-width="6" />
                <circle cx="222" cy="80" r="38" fill="none" stroke="${theme.accent}" stroke-width="6" stroke-linecap="round" class="ring-animated" transform="rotate(-90 222 80)" />
                <text x="222" y="91" text-anchor="middle" class="stat" style="font-size: 32px; fill: ${theme.text};">${streak.currentStreak}</text>
                <text x="222" y="142" text-anchor="middle" class="label" style="font-size: 14px; font-weight: 700; fill: ${theme.accent};">Current Streak</text>
                <text x="222" y="162" text-anchor="middle" class="date-range">${streak.currentRange}</text>
            </g>

            <!-- Right Column: Longest Streak -->
            <g class="stagger" style="animation-delay: 0.4s">
                <text x="370" y="90" text-anchor="middle" class="stat" style="font-size: 32px; fill: ${theme.accent};">${streak.totalRange ? streak.longestStreak : '0'}</text>
                <text x="370" y="115" text-anchor="middle" class="label" style="font-size: 14px; font-weight: 500;">Longest Streak</text>
                <text x="370" y="135" text-anchor="middle" class="date-range">${streak.longestRange}</text>
            </g>
        </g>
    </svg>`;
}

// ─── PINNED REPOS CARD ────────────────────────────────────────────────────────
function renderReposCard(repos, username, options = {}) {
    const theme = getTheme(options);
    const hideBorder = options.hide_border === 'true';
    const CARD_W = 495;
    const CARD_H = repos.length <= 3 ? 240 : 320;

    let repoItems = '';
    repos.slice(0, 6).forEach((repo, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col === 0 ? 0 : 235;
        const y = row * 85;
        const delay = 0.2 + i * 0.1;
        const langColor = repo.primaryLanguage?.color || '#ccc';
        const langName = repo.primaryLanguage?.name || 'Unknown';
        const desc = (repo.description || 'No description').substring(0, 38);
        repoItems += `
        <g transform="translate(${x}, ${y})">
            <g class="stagger" style="animation-delay: ${delay}s">
                <rect width="222" height="76" fill="${theme.text}" fill-opacity="0.04" rx="8" stroke="${theme.border}" stroke-opacity="0.5" />
                <text x="12" y="22" style="font: 600 13px 'Segoe UI', Sans-Serif; fill: ${theme.accent};">${repo.name}</text>
                <text x="12" y="40" style="font: 400 11px 'Segoe UI', Sans-Serif; fill: ${theme.text}; opacity: 0.75;">${desc}</text>
                <circle cx="20" cy="60" r="5" fill="${langColor}" />
                <text x="32" y="64" class="small">${langName}</text>
                <svg x="130" y="52" width="12" height="12" viewBox="0 0 16 16"><path fill="${theme.icon}" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                <text x="147" y="64" class="small">${repo.stargazerCount}</text>
                <svg x="168" y="52" width="12" height="12" viewBox="0 0 16 16"><path fill="${theme.icon}" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/></svg>
                <text x="185" y="64" class="small">${repo.forkCount}</text>
            </g>
        </g>`;
    });

    return `
    <svg width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${commonStyles(theme)}
        ${commonDefs(theme)}
        <rect x="0.5" y="0.5" width="${CARD_W - 1}" height="${CARD_H - 1}" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />
        <g transform="translate(25, 35)">
            <g class="stagger" style="animation-delay: 0.1s"><text x="0" y="0" class="header">${username}'s Pinned Repos</text></g>
            <g transform="translate(0, 20)">${repoItems}</g>
        </g>
    </svg>`;
}

module.exports = {
    renderStatsCard,
    renderLanguagesCard,
    renderStreakCard,
    renderReposCard,
    renderErrorCard
};
