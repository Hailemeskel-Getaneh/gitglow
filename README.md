# 🌟 GitGlow

**GitGlow** is a premium, high-performance GitHub statistics generator designed to make your profile README stand out. It provides real-time, dynamic cards for your stats, top languages, and contribution streaks with a focus on accuracy and aesthetics.

![GitGlow Preview](https://gitglow-three.vercel.app/api/streak?username=Hailemeskel-Getaneh&theme=glow&count_private=true)) 

## ✨ Features

- **Lifetime Accuracy**: Real-time lifetime totals for Commits, PRs, and Issues via the GitHub Search API.
* **8+ Premium Themes**: Curated palettes like **Glow**, **Radical**, **Tokyo Night**, and **Dracula**.
* **Private Commit Support**: Accurately counts your private contributions (requires `repo` scope).
* **Live UI Generator**: A sleek, tabbed dashboard to customize and preview your cards instantly.
* **Optimized Performance**: Built-in 2-hour server-side caching and rate limiting.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- A **GitHub Personal Access Token (PAT)**. [Create one here](https://github.com/settings/tokens/new?scopes=repo,read:user,user:follow). 

### 2. Installation
```bash
git clone https://github.com/Hailemeskel-Getaneh/gitglow.git
cd gitglow
npm install
```

### 3. Configuration
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Add your **GitHub PAT**:
```env
GITHUB_TOKEN=your_token_here
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to start glowing!

---

## ☁️ Deployment

### 📐 Deploy to Vercel (Recommended)
1. Fork this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com/) and click **"Add New"** > **"Project"**.
3. Import your `gitglow` repository.
4. In **Environment Variables**, add `GITHUB_TOKEN` with your Personal Access Token.
5. Click **Deploy**. Vercel will automatically use the included `vercel.json` configuration.

### 🚂 Deploy to Railway
1. Create a new project on [Railway](https://railway.app/).
2. Connect your GitHub repository.
3. Add `GITHUB_TOKEN` in the **Variables** tab.
4. Railway will automatically detect the `start` script and deploy.

---

## 🎨 API Usage

### Endpoints
- **Stats**: `/api/stats?username=USER` 
- **Languages**: `/api/languages?username=USER`
- **Streak**: `/api/streak?username=USER`
- **Repos**: `/api/repos?username=USER`

### Query Parameters
| Parameter | Description |
| --- | --- |
| `username` | Your GitHub username (Required) |
| `theme` | `dark`, `midnight`, `glow`, `radical`, `tokyonight`, `dracula`, `ocean`, `solarized` |
| `count_private` | Set to `true` to include private contributions |
| `hide_border` | Set to `true` to remove the card border |
| `hide` | Comma-separated list of stats to hide (e.g., `stars,commits`) |

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express
- **Data**: GitHub GraphQL & Search APIs
- **Visuals**: Dynamic SVG Rendering Engine
- **Styling**: Vanilla CSS (Premium Micro-animations)
- **Caching**: Node-Cache (2-hour TTL)

---

Built with ♥ for the developer community.

