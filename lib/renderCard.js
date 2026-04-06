/**
 * Premium SVG Rendering Engine for GitGlow
 */

const THEMES = {
    dark: {
        bg: '#0d1117',
        text: '#c9d1d9',
        accent: '#58a6ff',
        border: '#30363d',
        icon: '#8b949e'
    },
    midnight: {
        bg: '#000000',
        text: '#ffffff',
        accent: '#ff00ff',
        border: '#111111',
        icon: '#ff00ff'
    },
    glow: {
        bg: '#0d1117',
        bg2: '#161b22',
        text: '#e6edf3',
        accent: '#7ee787',
        border: '#30363d',
        icon: '#7ee787'
    }
};

function renderStatsCard(stats, options = {}) {
    const theme = THEMES[options.theme] || THEMES.dark;
    const hideBorder = options.hide_border === 'true';
    
    const svg = `
    <svg width="495" height="220" viewBox="0 0 495 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .value { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .stagger { animation: fadeIn 0.5s ease-in-out forwards; opacity: 0; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>
        
        <defs>
            <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${theme.bg}" />
                <stop offset="100%" stop-color="${theme.bg2 || theme.bg}" />
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
        </defs>
        
        <rect x="0.5" y="0.5" width="494" height="219" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />
        
        <g transform="translate(25, 35)">
            <g class="stagger" style="animation-delay: 0.1s">
                <text x="0" y="0" class="header">${stats.name}'s GitHub Stats</text>
            </g>
            
            <g transform="translate(0, 35)">
                <!-- Stars -->
                <g class="stagger" style="animation-delay: 0.2s">
                    <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                    <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="${theme.icon}" fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    <text x="36" y="25" class="label">Total Stars</text>
                    <text x="200" y="25" text-anchor="end" class="value">${stats.stars}</text>
                </g>
                
                <!-- Commits -->
                <g transform="translate(230, 0)">
                    <g class="stagger" style="animation-delay: 0.3s">
                        <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                        <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="${theme.icon}" fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"/>
                        </svg>
                        <text x="36" y="25" class="label">Total Commits</text>
                        <text x="200" y="25" text-anchor="end" class="value">${stats.commits}</text>
                    </g>
                </g>

                <!-- PRs -->
                <g transform="translate(0, 50)">
                    <g class="stagger" style="animation-delay: 0.4s">
                        <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                        <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="${theme.icon}" fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>
                        </svg>
                        <text x="36" y="25" class="label">Total PRs</text>
                        <text x="200" y="25" text-anchor="end" class="value">${stats.prs}</text>
                    </g>
                </g>

                <!-- Issues -->
                <g transform="translate(230, 50)">
                    <g class="stagger" style="animation-delay: 0.5s">
                        <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                        <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="${theme.icon}" fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/>
                        </svg>
                        <text x="36" y="25" class="label">Total Issues</text>
                        <text x="200" y="25" text-anchor="end" class="value">${stats.issues}</text>
                    </g>
                </g>

                <!-- Contributed -->
                <g transform="translate(0, 100)">
                    <g class="stagger" style="animation-delay: 0.6s">
                        <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                        <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="${theme.icon}" fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                        </svg>
                        <text x="36" y="25" class="label">Contributed To</text>
                        <text x="200" y="25" text-anchor="end" class="value">${stats.contributedRepo}</text>
                    </g>
                </g>

                <!-- Followers -->
                <g transform="translate(230, 100)">
                    <g class="stagger" style="animation-delay: 0.7s">
                        <rect width="215" height="40" fill="${theme.text}" fill-opacity="0.05" rx="8" />
                        <svg x="12" y="12" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="${theme.icon}" fill-rule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416 1.336 5.526 5.526 0 013.183 4.535.75.75 0 001.493-.15 7.014 7.014 0 00-4.04-5.615A3 3 0 0011 4z"/>
                        </svg>
                        <text x="36" y="25" class="label">Followers</text>
                        <text x="200" y="25" text-anchor="end" class="value">${stats.followers}</text>
                    </g>
                </g>
            </g>
        </g>
    </svg>`;
    
    return svg;
}

function renderLanguagesCard(languages, options = {}) {
    const theme = THEMES[options.theme] || THEMES.dark;
    const hideBorder = options.hide_border === 'true';

    let bars = '';
    let labels = '';
    let currentX = 0;

    languages.forEach((lang, i) => {
        const width = (lang.percentage / 100) * 445;
        bars += `<rect x="${currentX}" y="0" width="${width}" height="8" fill="${lang.color}" rx="4" />`;
        currentX += width;

        if (i < 5) {
            labels += `
            <g transform="translate(${i % 2 === 0 ? 0 : 200}, ${Math.floor(i / 2) * 25})">
                <circle cx="5" cy="-5" r="5" fill="${lang.color}" />
                <text x="15" y="0" class="label">${lang.name} ${lang.percentage.toFixed(1)}%</text>
            </g>`;
        }
    });

    const svg = `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .label { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .stagger { animation: fadeIn 0.5s ease-in-out forwards; opacity: 0; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>

        <defs>
            <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${theme.bg}" />
                <stop offset="100%" stop-color="${theme.bg2 || theme.bg}" />
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
        </defs>

        <rect x="0.5" y="0.5" width="494" height="194" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />

        <g transform="translate(25, 35)">
            <g class="stagger">
                <text x="0" y="0" class="header">Most Used Languages</text>
            </g>
            
            <g transform="translate(0, 35)">
                <g class="stagger" style="animation-delay: 0.2s">
                    <mask id="rect-mask">
                        <rect x="0" y="0" width="445" height="10" rx="5" fill="white" />
                    </mask>
                    <g mask="url(#rect-mask)">
                        ${bars}
                    </g>
                </g>
            </g>

            <g transform="translate(0, 75)">
                <g class="stagger" style="animation-delay: 0.4s">
                    ${labels}
                </g>
            </g>
        </g>
    </svg>`;

    return svg;
}

function renderStreakCard(streak, options = {}) {
    const theme = THEMES[options.theme] || THEMES.dark;
    const hideBorder = options.hide_border === 'true';

    const svg = `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .stat { font: 600 28px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.accent}; }
            .label { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
            .stagger { animation: fadeIn 0.5s ease-in-out forwards; opacity: 0; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        </style>

        <defs>
            <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${theme.bg}" />
                <stop offset="100%" stop-color="${theme.bg2 || theme.bg}" />
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
        </defs>

        <rect x="0.5" y="0.5" width="494" height="194" rx="12" fill="url(#bg_grad)" stroke="${hideBorder ? 'none' : theme.border}" filter="url(#shadow)" />

        <g transform="translate(25, 35)">
            <g class="stagger">
                <text x="0" y="0" class="header">GitHub Streak Stats</text>
            </g>
            
            <g transform="translate(0, 45)">
                <!-- Total Contributions (Center X: 74) -->
                <g class="stagger" style="animation-delay: 0.2s">
                    <text x="74" y="45" text-anchor="middle" class="stat" style="font-size: 26px;">${streak.total}</text>
                    <text x="74" y="75" text-anchor="middle" class="label">Total Contribs</text>
                </g>
                
                <!-- Current Streak Ring (Center X: 222.5) -->
                <g class="stagger" style="animation-delay: 0.3s">
                    <!-- Background ring -->
                    <circle cx="222.5" cy="40" r="38" fill="none" stroke="${theme.text}" stroke-opacity="0.1" stroke-width="6" />
                    <!-- Golden Streak ring -->
                    <circle cx="222.5" cy="40" r="38" fill="none" stroke="#fb8c00" stroke-width="6" stroke-linecap="round" stroke-dasharray="210, 42" transform="rotate(-90 222.5 40)" />
                    
                    <text x="222.5" y="50" text-anchor="middle" class="stat" style="font-size: 32px; fill: ${theme.text};">${streak.currentStreak}</text>
                    <text x="222.5" y="105" text-anchor="middle" class="label" style="font-weight: 600; fill: #fb8c00;">Current Streak</text>
                </g>
                
                <!-- Longest Streak (Center X: 371) -->
                <g class="stagger" style="animation-delay: 0.4s">
                    <text x="371" y="45" text-anchor="middle" class="stat" style="font-size: 26px;">${streak.longestStreak}</text>
                    <text x="371" y="75" text-anchor="middle" class="label">Longest Streak</text>
                </g>
            </g>
        </g>
    </svg>`;

    return svg;
}

module.exports = {
    renderStatsCard,
    renderLanguagesCard,
    renderStreakCard
};
