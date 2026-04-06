const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for 2 hours to avoid rate limits
const cache = new NodeCache({ stdTTL: 7200 });

/**
 * Fetch GitHub Statistics via GraphQL
 */
async function fetchStats(username, token, countPrivate = false) {
  const cachedData = cache.get(`stats-${username}`);
  if (cachedData) return cachedData;

  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        name
        login
        followers {
          totalCount
        }
        repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
        contributionsCollection {
          restrictedContributionsCount
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query, variables: { login: username } },
      { headers: { Authorization: `bearer ${token}` } }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const user = response.data.data.user;
    const totalStars = user.repositories.nodes.reduce((acc, repo) => acc + repo.stargazers.totalCount, 0);

    const stats = {
      name: user.name || user.login,
      username: user.login,
      stars: totalStars,
      commits: user.contributionsCollection.totalCommitContributions + (countPrivate ? user.contributionsCollection.restrictedContributionsCount : 0),
      prs: user.contributionsCollection.totalPullRequestContributions,
      issues: user.contributionsCollection.totalIssueContributions,
      contributedRepo: user.repositoriesContributedTo.totalCount,
      followers: user.followers.totalCount,
      reviews: user.contributionsCollection.totalPullRequestReviewContributions
    };

    cache.set(`stats-${username}`, stats);
    return stats;
  } catch (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }
}

/**
 * Fetch Top Languages Usage
 */
async function fetchLanguages(username, token) {
    const cachedData = cache.get(`langs-${username}`);
    if (cachedData) return cachedData;

    const query = `
      query userLangs($login: String!) {
        user(login: $login) {
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
            nodes {
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query, variables: { login: username } },
            { headers: { Authorization: `bearer ${token}` } }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        const user = response.data.data.user;
        if (!user) {
            throw new Error(`Could not resolve to a User with the login of '${username}'.`);
        }

        const repos = user.repositories.nodes;
        const languagesMap = {};
        let totalSize = 0;

        repos.forEach(repo => {
            repo.languages.edges.forEach(edge => {
                const langName = edge.node.name;
                const langColor = edge.node.color;
                const size = edge.size;

                if (languagesMap[langName]) {
                    languagesMap[langName].size += size;
                } else {
                    languagesMap[langName] = { size, color: langColor };
                }
                totalSize += size;
            });
        });

        // Convert to array and sort
        const languages = Object.keys(languagesMap)
            .map(name => ({
                name,
                size: languagesMap[name].size,
                color: languagesMap[name].color,
                percentage: (languagesMap[name].size / totalSize) * 100
            }))
            .sort((a, b) => b.size - a.size)
            .slice(0, 8); // Top 8 languages

        cache.set(`langs-${username}`, languages);
        return languages;
    } catch (error) {
        throw new Error(`Failed to fetch languages: ${error.message}`);
    }
}

/**
 * Fetch Contributions for Streak
 */
async function fetchStreak(username, token) {
    const cachedData = cache.get(`streak-${username}`);
    if (cachedData) return cachedData;

    const query = `
      query userStreak($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query, variables: { login: username } },
            { headers: { Authorization: `bearer ${token}` } }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        const user = response.data.data.user;
        if (!user) {
            throw new Error(`Could not resolve to a User with the login of '${username}'.`);
        }

        const calendar = user.contributionsCollection.contributionCalendar;
        const days = [];
        calendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                days.push(day);
            });
        });

        // Calculate Streak (Simplified)
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const reversedDays = [...days].reverse();
        let countingCurrent = true;

        reversedDays.forEach((day, index) => {
            if (day.contributionCount > 0) {
                tempStreak++;
                if (countingCurrent) currentStreak++;
            } else {
                if (index > 0 || day.date !== new Date().toISOString().split('T')[0]) {
                  // If it's not today, and no contribution, current streak ends
                  countingCurrent = false;
                }
                if (tempStreak > longestStreak) longestStreak = tempStreak;
                tempStreak = 0;
            }
        });

        if (tempStreak > longestStreak) longestStreak = tempStreak;

        const streakResult = {
            total: calendar.totalContributions,
            currentStreak,
            longestStreak
        };

        cache.set(`streak-${username}`, streakResult);
        return streakResult;
    } catch (error) {
        throw new Error(`Failed to fetch streak: ${error.message}`);
    }
}

module.exports = {
  fetchStats,
  fetchLanguages,
  fetchStreak
};
