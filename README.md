# AI Landing Page Generator MVP

A full-stack MVP to generate simple forms or full landing pages using AI.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express (deployed on Render)
- **Database**: Supabase
- **AI**: OpenAI GPT-4

## Prerequisites

- Node.js installed
- Supabase account
- OpenAI API Key

## Setup Instructions

### 1. Database (Supabase)

1. Create a new project in Supabase.
2. Go to the SQL Editor and run the contents of `supabase_schema.sql`.
3. Get your Project URL and Anon Key from Project Settings > API.

### 2. Backend

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create a `.env` file based on `.env.example` (or just `.env` provided):
   ```
   OPENAI_API_KEY=your_openai_key
   PORT=3000
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm start
   ```
   The server will run on `http://localhost:3000`.

### 3. Frontend

1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Create a `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BACKEND_URL=http://localhost:3000/api/generate
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
   The app will run on `http://localhost:5173`.

## Deployment

### Backend (Render)

1. Create a new Web Service on Render.
2. Connect your repository.
3. Set Root Directory to `backend`.
4. Set Build Command to `npm install`.
5. Set Start Command to `node server.js`.
6. Add Environment Variables (`OPENAI_API_KEY`).

### Frontend (Netlify)

1. Create a new site on Netlify.
2. Connect your repository.
3. Set Base Directory to `frontend`.
4. Set Build Command to `npm run build`.
5. Set Publish Directory to `frontend/dist`.
6. Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BACKEND_URL` pointing to your Render URL).
