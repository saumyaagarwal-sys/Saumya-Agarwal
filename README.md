# 🌤️ Weather Intelligence App

A real-time single-page Weather Intelligence web application generated using **Google AI Studio App Build**, pushed to **GitHub**, and deployed live on **Cloudflare**.

---

## 📌 Project Overview

The **Weather Intelligence App** enables users to search for any city globally, view current atmospheric metrics, inspect a 7-day weather forecast with visual charts, and receive smart, condition-based planning recommendations.

### Key Features
- 🔍 **City Search**: Instant geocoding and location query.
- 🌡️ **Current Weather Hero**: Real-time temperature, wind speed, humidity, UV index, and atmospheric condition displays[cite: 1].
- 📅 **7-Day Forecast & Charts**: Daily max/min temperature ranges and visual trends[cite: 1].
- 💡 **Planning Intelligence**: Smart activity and travel advice tailored to current weather metrics[cite: 1].
- 🛑 **Error Handling**: Graceful feedback banners for invalid city searches or network errors.

---

## 🛠️ Tech Stack & Public APIs

- **UI Framework**: React (TypeScript) + Vite
- **Styling & Icons**: Tailwind CSS + Lucide React Icons
- **Deployment Platform**: Cloudflare Pages / Workers
- **Public APIs**:
  - **Open-Meteo Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search` (Converts city names into latitude/longitude coordinates)[cite: 1]
  - **Open-Meteo Forecast API**: `https://api.open-meteo.com/v1/forecast` (Fetches current weather and 7-day forecast data)[cite: 1]

---

## 🚀 Step-by-Step Instructions: AI Studio to GitHub & Cloudflare Deployment

### Step 1: App Generation in Google AI Studio
1. Created the React/Vite Weather Intelligence prototype using Google AI Studio App Build.
2. Verified interactive features (city search, forecast cards, charts, error states) inside the Studio preview.

### Step 2: GitHub Repository Setup
1. Downloaded/exported the generated app source code from Google AI Studio.
2. Created a new GitHub repository using company/organization credentials.
3. Pushed the project source code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from Google AI Studio App Build"
   git branch -M main
   git remote add origin [https://github.com/YOUR_USERNAME/weather-intelligence.git](https://github.com/YOUR_USERNAME/weather-intelligence.git)
   git push -u origin main
