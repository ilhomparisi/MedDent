# Running with Docker (single Dockerfile)

One image serves both the API and the frontend on **port 3000**. MongoDB must run separately (local or Atlas).

## Build

From the project root, with your API URL for the frontend (use your domain so admin works):

```bash
docker build -f Dockerfile --build-arg VITE_API_URL=https://yourdomain.com/api -t meddent .
```

For local only:

```bash
docker build -f Dockerfile --build-arg VITE_API_URL=http://localhost:3000/api -t meddent .
```

## Run

Use the root `.env` file. Ensure it has at least `MONGODB_URI`, `JWT_SECRET` (min 32 chars), and optionally `VITE_API_URL`, `FRONTEND_URL`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `RUN_SEED_ON_START`.

**With env file:**

```bash
docker run -p 3000:3000 --env-file .env -v "%CD%\backend\uploads:/app/uploads" meddent
```

**Example with MongoDB on host:**

```bash
docker run -p 3000:3000 --env-file .env -e MONGODB_URI=mongodb://host.docker.internal:27017/meddent -e JWT_SECRET=your-secret-min-32-chars -v "%CD%\backend\uploads:/app/uploads" meddent
```

On Linux/macOS use `$(pwd)/backend/uploads` instead of `%CD%\backend\uploads`.

- App (frontend + API): **http://localhost:3000**
- API only: **http://localhost:3000/api**
- Health: **http://localhost:3000/health**

MongoDB must be reachable from the container (e.g. `mongodb://host.docker.internal:27017/meddent` on Docker Desktop, or a cloud URI).

## On the server

Set **FRONTEND_URL** (or **PUBLIC_URL**) in `.env` to the public URL users use to open the app, e.g. `https://meddent.uz` (no trailing slash). The backend will use it for CORS and for the startup log so you see the real API URL instead of localhost.

If you see a **blank screen** after deploy: open the browser dev tools (F12) → Console and Network. Ensure the page and API are on the same origin (e.g. both `https://meddent.uz`). If the app is served at a subpath (e.g. `https://example.com/app/`), rebuild with `--build-arg VITE_BASE_URL=/app/`.
