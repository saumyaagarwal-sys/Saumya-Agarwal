# 🌤️ Weather Intelligence App

A sleek, real-time single-page Weather Intelligence web application generated using **Google AI Studio App Build**, connected to **GitHub**, and deployed live on **Cloudflare Pages**.

---

## 📌 Project Overview

The **Weather Intelligence App** enables users to search for any city globally, view current atmospheric metrics, inspect a 7-day weather forecast with visual charts, and receive smart, condition-based planning recommendations.

### Key Features
- 🔍 **City Search**: Instant geocoding and location query.
- 🌡️ **Current Weather Hero**: Real-time temperature, wind speed, humidity, UV index, and atmospheric condition displays.
- 📅 **7-Day Forecast & Charts**: Daily max/min temperature ranges and trends visualized with dynamic UI components.
- 💡 **Planning Intelligence**: Smart activity and travel advice tailored to current weather metrics.
- 🛑 **Error Handling**: Graceful feedback banners for invalid city searches or network errors.

---

## 🛠️ Tech Stack & Public APIs

- **UI Framework**: React (TypeScript) + Vite
- **Styling & Icons**: Tailwind CSS + Lucide React Icons
- **Deployment Platform**: Cloudflare Pages
- **Public APIs**:
  - **Open-Meteo Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search` (Converts city names into coordinates)
  - **Open-Meteo Forecast API**: `https://api.open-meteo.com/v1/forecast` (Fetches current weather and 7-day forecast data)

---

## 🚀 How This Project Was Built & Deployed

### Step 1: App Building in Google AI Studio
1. Created the React/Vite Weather Intelligence prototype using Google AI Studio App Build.
2. Verified interactive features (city search, forecast cards, charts, error states) inside the Studio preview.

### Step 2: GitHub Repository Connection
1. Connected Google AI Studio directly to GitHub (or exported the generated source code into this repository).
2. Verified essential root artifacts: `package.json`, `src/`, `vite.config.ts`, and project dependencies.

### Step 3: Cloudflare Pages Deployment
1. Logged into Cloudflare Dashboard → **Workers & Pages** → **Connect to Git**.
2. Linked this GitHub repository and configured the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. Successfully deployed the production build to Cloudflare Pages.

---

## 💻 Local Development Setup

To run this project locally on your machine:

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/weather-intelligence-app.git](https://github.com/YOUR_USERNAME/weather-intelligence-app.git)

# 2. Navigate to project directory
cd weather-intelligence-app

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
