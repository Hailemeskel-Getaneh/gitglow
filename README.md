# 🌟 GitGlow

**GitGlow** is a premium, high-performance GitHub statistics generator designed to make your profile README stand out. It provides real-time, dynamic cards for your stats, top languages, and contribution streaks.

![GitGlow Preview](https://github-readme-stats.vercel.app/api?username=Hailemeskel-Getaneh&theme=dark) *(Example style)*

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- A **GitHub Personal Access Token (PAT)**. [Create one here](https://github.com/settings/tokens/new?scopes=repo,read:user,user:follow). (No specific scopes needed for public stats, but `repo` and `user` are recommended).

### 2. Installation
Clone this repository and install dependencies:
```bash
npm install
```

### 3. Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Open `.env` and add your **GitHub PAT**:
```env
GITHUB_TOKEN=your_token_here
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to use the premium URL generator!

---

## 🎨 API Usage

### General Stats
`GET /api/stats?username=yourusername&theme=glow`

### Top Languages
`GET /api/languages?username=yourusername&theme=midnight`

### Streak Stats
`GET /api/streak?username=yourusername&theme=dark`

### Query Parameters
| Parameter | Description |
| --- | --- |
| `username` | Your GitHub username (Required) |
| `theme` | `dark`, `midnight`, or `glow` |
| `hide_border` | Set to `true` to remove the card border |

---

## ☁️ Deployment (Render / Vercel)

1. Connect your GitHub repository to **Render**.
2. Set the **Build Command** to `npm install`.
3. Set the **Start Command** to `npm start`.
4. Add your `GITHUB_TOKEN` as an **Environment Variable** in the Render dashboard.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express
- **Data**: GitHub GraphQL API (Octokit)
- **Visuals**: Dynamic SVG Templates
- **Caching**: Node-Cache (2-hour TTL)
# gitglow
