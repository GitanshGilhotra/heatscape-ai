# HEATSCAPE AI // Urban Heat Intelligence & Green Infrastructure Planner

> **Production-quality, futuristic, AI-powered Urban Heat Island Prediction and Green Zone Recommendation Platform.**

HEATSCAPE AI combines NASA climate command center aesthetics with real machine learning spatial regressions, Leaflet GIS mapping, procedural 3D microclimate simulations, Qdrant vector memory, and an AI urban planner assistant.

---

## 🚀 Core Architecture

HEATSCAPE AI is organized into three decoupled, production-grade microservices:

```
heatscape-ai/
├── client/          # Vite + React 18 + Three.js (@react-three/fiber) + Leaflet GIS + Tailwind CSS + Recharts
├── server/          # Node.js + Express + JWT Authentication + Climate Datasets API
└── ml-service/      # Python FastAPI + Scikit-learn + XGBoost + Qdrant Vector Store + RAG Engine
```

### 1. Frontend (`client/`)
- **Interactive 3D Viewports**: Rotating 3D Earth globe with orbital satellite laser scanning beam (`EarthGlobe.jsx`), procedural 3D mini-city with thermal color maps & raycast tooltip cards (`FuturisticMiniCity.jsx`), 3D vector network graph (`VectorGraph3D.jsx`).
- **Interactive GIS Map**: Leaflet map with satellite tiles, Land Surface Temperature (LST) heat overlays, NDVI canopy indices, zone popups, and city filters (`InteractiveGisMap.jsx`).
- **Cooling Simulator & Prediction**: Live "What If?" sliders computing temperature drop °C, ML model benchmark comparisons (XGBoost vs Random Forest vs Linear Regression), and feature importance breakdown.
- **AI Assistant**: Cyberpunk command chat backed by Qdrant vector memory embeddings & LangChain RAG pipeline.
- **Reporting & Auth**: Downloadable PDF Urban Heat Assessment report generator (`ReportGeneratorModal.jsx`) and JWT auth modal (`AuthModal.jsx`).

### 2. Backend (`server/`)
- Express.js API server running on port `5000`.
- Serves real-world urban climate datasets (New Delhi, Phoenix, Tokyo, Mumbai, London, Singapore, NYC) and green intervention catalogs.
- Handles user signups, logins, and JWT session authorization.

### 3. ML & RAG Core (`ml-service/`)
- FastAPI server running on port `8000`.
- Pre-trained / synthesized XGBoost and Random Forest regressors predicting Land Surface Temperature (LST in °C) & UHI Intensity based on NDVI, Building Density, Impervious Surface Ratio, Relative Humidity, and Ambient Temperature.
- Spatial optimization algorithm ranking green infrastructure interventions by cooling delta per $ / m².
- Qdrant vector memory simulation & RAG pipeline serving structured AI urban planning insights.

---

## 🛠️ Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.10+

### 1. Start the Node.js Express Server
```bash
cd server
npm install
npm run dev
```
*Runs at `http://localhost:5000`*

### 2. Start the Python ML & RAG Engine
```bash
cd ml-service
python main.py
```
*Runs at `http://localhost:8000`*

### 3. Start the React Frontend
```bash
cd client
npm install
npm run dev
```
*Runs at `http://localhost:3000`*

---

## 🛰️ Environment Variables (Optional)

Create `.env` in `client/`, `server/`, or `ml-service/`:

```env
PORT=5000
JWT_SECRET=heatscape_cyberpunk_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_URL=http://localhost:6333
```

*(Note: The system contains built-in offline fallbacks for all AI and database services, allowing it to run out of the box without requiring external API keys!)*

---

## 🌍 UN SDG Alignment
- **SDG 11**: Sustainable Cities and Communities (Target 11.7)
- **SDG 13**: Climate Action (Target 13.1)
