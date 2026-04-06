require('dotenv').config();
const express = require('express');
const path = require('path');
const { fetchStats, fetchLanguages, fetchStreak } = require('./lib/github');
const { renderStatsCard, renderLanguagesCard, renderStreakCard } = require('./lib/renderCard');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route: /api/stats
 */
app.get('/api/stats', async (req, res) => {
    const { username, theme, hide_border, count_private } = req.query;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const stats = await fetchStats(username, process.env.GITHUB_TOKEN, count_private === 'true');
        const svg = renderStatsCard(stats, { theme, hide_border });

        res.setHeader('Content-Type', 'image/svg+xml');
        if (process.env.NODE_ENV === 'development') {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=7200'); // Cache for 2 hours
        }
        res.send(svg);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating stats card');
    }
});

/**
 * Route: /api/languages
 */
app.get('/api/languages', async (req, res) => {
    const { username, theme, hide_border } = req.query;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const languages = await fetchLanguages(username, process.env.GITHUB_TOKEN);
        const svg = renderLanguagesCard(languages, { theme, hide_border });

        res.setHeader('Content-Type', 'image/svg+xml');
        if (process.env.NODE_ENV === 'development') {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=7200');
        }
        res.send(svg);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating language card');
    }
});

/**
 * Route: /api/streak
 */
app.get('/api/streak', async (req, res) => {
    const { username, theme, hide_border } = req.query;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const streak = await fetchStreak(username, process.env.GITHUB_TOKEN);
        const svg = renderStreakCard(streak, { theme, hide_border });

        res.setHeader('Content-Type', 'image/svg+xml');
        if (process.env.NODE_ENV === 'development') {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=7200');
        }
        res.send(svg);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating streak card');
    }
});

app.listen(PORT, () => {
    console.log(`GitGlow server running at http://localhost:${PORT}`);
});
