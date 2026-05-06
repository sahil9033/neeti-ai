# NEETI Deployment

## Deployment Architecture
- **Frontend**: Firebase Hosting
- **Backend**: Render Web Service
- **Repo structure**:
  - `backend/` — Node/Express backend
  - `frontend/` — React + Vite frontend
  - `render.yaml` — Render config for backend only
  - `frontend/firebase.json` — Firebase Hosting config
  - `frontend/.firebaserc` — Firebase project mapping
  - `frontend/.env.production.template` — Production env template

## Backend (Render)
1. Push the repo to GitHub.
2. In Render, connect your GitHub repository.
3. Create a new **Web Service**.
4. Use these settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: `node`
   - Plan: `free`
5. Set environment variables in Render dashboard:
   - `OPENROUTER_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT`
   - `PORT=10000`
6. Deploy.

### Backend notes
- `backend/server.js` already reads `process.env.PORT`.
- `render.yaml` is configured to deploy only the backend service.
- The backend route namespace is `/api`.

## Frontend (Firebase Hosting)
1. Install Firebase CLI if needed:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate with Firebase:
   ```bash
   firebase login
   ```
3. Change to the frontend folder:
   ```bash
   cd frontend
   ```
4. Build the frontend:
   ```bash
   npm install
   npm run build
   ```
5. Create a production env file from the template:
   ```bash
   cp .env.production.template .env.production
   ```
6. Edit `frontend/.env.production` and set:
   - `VITE_API_URL=https://YOUR_RENDER_BACKEND_URL.onrender.com`
7. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

### Firebase config included
- `frontend/firebase.json`
- `frontend/.firebaserc`

## Local development
### Backend
```bash
cd backend
npm install
npm start
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Important
- Do not commit actual `.env` or `.env.production` files.
- `backend/.env.template` and `frontend/.env.production.template` are safe to keep in the repo.
- The root `.env` file has been removed to avoid leaking secret keys.
