# FasalDoctor — AI Melon Crop Disease Detection & Agricultural Advisory

FasalDoctor is a multilingual (English & Urdu RTL) web application built with **React, TypeScript, Vite, and Tailwind CSS** to help melon farmers detect possible crop diseases early, view weather-based fungal risk advisories, and independently consult agricultural experts.

> **Note:** When the FastAPI backend (`MobileNetV2`, `Faster-Whisper`, Weather API, PostgreSQL) is not running, the frontend automatically operates in a clearly labeled **Demonstration Mode** using realistic mock data and `localStorage` persistence.

## Features

- **Public Website:** Landing page, About, 7-step How It Works, Login, Registration, and Password Reset.
- **Farmer Portal (`/farmer/*`):**
  - Overview dashboard with scan stats, weather summary, Recharts health chart, and notifications
  - AI Melon Disease Detection (drag & drop, file browse, camera capture, quick demo leaves, animated scan progress, and detailed results report)
  - Scan History with search, filters, grid/list view, and pagination
  - 7-Day Weather Advisory with humidity/rainfall trend charts and indicative fungal risk guidance
  - **Ask FasalDoctor** bilingual (English / اردو RTL) assistant with push-to-talk demo interface
  - Independent Agricultural Expert discovery, consultation submission, request tracking, and threaded replies
  - Bilingual Knowledge Center and Profile/Settings
- **Agricultural Expert Portal (`/expert/*`):**
  - Expert dashboard with incoming queue, assigned cases, and weekly activity chart
  - Case review view with farmer info, submitted crop images, shared scan context, and bilingual (EN/UR) recommendation composer

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended) and `npm`

### Setup & Start

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd <REPO_FOLDER_NAME>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Visit the URL printed in the terminal (usually `http://localhost:5173`).

### Quick Demo Login
Go to **`/login`** and click:
- **Demo Farmer** to explore the Farmer Portal
- **Demo Expert** to explore the Agricultural Expert Portal

### Optional Backend Configuration
Copy `.env.example` to `.env` if connecting to a local FastAPI backend:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Build for Production
```bash
npm run build
```
