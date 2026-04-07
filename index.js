require('dotenv').config();
const express = require('express');
const path = require('path');
const { fetchStats, fetchLanguages, fetchStreak, fetchPinnedRepos } = require('./lib/github');
const { renderStatsCard, renderLanguagesCard, renderStreakCard, renderReposCard, renderErrorCard } = require('./lib/renderCard');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow GitHub's CDN and browsers everywhere to load these SVGs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
// Simple in-memory rate limiter: max 30 requests per minute per IP
const rateLimitMap = new Map();
function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return next();
    }
    const data = rateLimitMap.get(ip);
    if (now - data.start > windowMs) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return next();
    }
    if (data.count >= maxRequests) {
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.status(429).send(renderErrorCard('Rate limit exceeded. Try again in 1 minute.'));
    }
    data.count++;
    next();
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function svgResponse(res, svg) {
    res.setHeader('Content-Type', 'image/svg+xml');
    if (process.env.NODE_ENV === 'development') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
        res.setHeader('Cache-Control', 'public, max-age=7200');
    }
    res.send(svg);
}

// ─── STATIC FRONTEND ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'GitGlow',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// ─── STATS CARD ───────────────────────────────────────────────────────────────
app.get('/api/stats', rateLimiter, async (req, res) => {
    const { username, theme, hide_border, count_private, hide, title_color, text_color, icon_color, bg_color } = req.query;

    if (!username) {
        return svgResponse(res, renderErrorCard('Username parameter is required.'));
    }

    try {
        const stats = await fetchStats(username, process.env.GITHUB_TOKEN, count_private === 'true');
        const svg = renderStatsCard(stats, { theme, hide_border, hide, title_color, text_color, icon_color, bg_color });
        svgResponse(res, svg);
    } catch (error) {
        console.error(error.message);
        svgResponse(res, renderErrorCard(error.message.replace('Failed to fetch stats: ', '')));
    }
});

// ─── LANGUAGES CARD ───────────────────────────────────────────────────────────
app.get('/api/languages', rateLimiter, async (req, res) => {
    const { username, theme, hide_border, title_color, text_color, bg_color } = req.query;

    if (!username) {
        return svgResponse(res, renderErrorCard('Username parameter is required.'));
    }

    try {
        const languages = await fetchLanguages(username, process.env.GITHUB_TOKEN);
        const svg = renderLanguagesCard(languages, { theme, hide_border, title_color, text_color, bg_color });
        svgResponse(res, svg);
    } catch (error) {
        console.error(error.message);
        svgResponse(res, renderErrorCard(error.message.replace('Failed to fetch languages: ', '')));
    }
});

// ─── STREAK CARD ──────────────────────────────────────────────────────────────
app.get('/api/streak', rateLimiter, async (req, res) => {
    const { username, theme, hide_border, count_private, title_color, text_color, bg_color } = req.query;

    if (!username) {
        return svgResponse(res, renderErrorCard('Username parameter is required.'));
    }

    try {
        const streak = await fetchStreak(username, process.env.GITHUB_TOKEN, count_private === 'true');
        const svg = renderStreakCard(streak, { theme, hide_border, title_color, text_color, bg_color });
        svgResponse(res, svg);
    } catch (error) {
        console.error(error.message);
        svgResponse(res, renderErrorCard(error.message.replace('Failed to fetch streak: ', '')));
    }
});

// ─── PINNED REPOS CARD ────────────────────────────────────────────────────────
app.get('/api/repos', rateLimiter, async (req, res) => {
    const { username, theme, hide_border, title_color, text_color, bg_color } = req.query;

    if (!username) {
        return svgResponse(res, renderErrorCard('Username parameter is required.'));
    }

    try {
        const repos = await fetchPinnedRepos(username, process.env.GITHUB_TOKEN);
        const svg = renderReposCard(repos, username, { theme, hide_border, title_color, text_color, bg_color });
        svgResponse(res, svg);
    } catch (error) {
        console.error(error.message);
        svgResponse(res, renderErrorCard(error.message.replace('Failed to fetch repos: ', '')));
    }
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✨ GitGlow server running at http://localhost:${PORT}`);
});
