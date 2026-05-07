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
- Use `backend/.env.example` as a local development helper.
- You can load Firebase credentials from `FIREBASE_SERVICE_ACCOUNT` or from a JSON file path with `FIREBASE_SERVICE_ACCOUNT_PATH`.
- For local frontend development, use `frontend/.env.development` for startup configuration.
- The app includes a test page at `/test` for auth and OpenRouter AI validation.

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
### From the repository root
Use the repo root scripts to start the backend from the correct folder:
```bash
npm install
npm start
```
This starts the backend server and serves the built frontend from `frontend/dist` on `http://localhost:3001`.

### Frontend dev mode
If you want Vite hot reload instead of backend static hosting:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

### Important
Do not use VS Code Live Server on the repository root or port `5500`.
That only shows the workspace file tree and does not run the React app.

The frontend is preconfigured with `frontend/.env.development` for local development and includes your Firebase project values.
This file also includes `VITE_FIREBASE_DATABASE_URL` for your Firebase Realtime Database, even though the current app uses Firebase Auth and Firestore.

Once both backend and frontend are running, open:

- `http://localhost:3001` when the backend is serving the built app
- `http://localhost:5173` for Vite dev
- `http://localhost:5173/test` to verify Firebase auth and OpenRouter AI

## Important
- Do not commit actual `.env` or `.env.production` files.
- `backend/.env.example` and `frontend/.env.production.template` are safe to keep in the repo.
- The root `.env` file has been removed to avoid leaking secret keys.
