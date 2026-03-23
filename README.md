# Raghav Portfolio

A production-style personal portfolio with a **vanilla HTML/CSS/JS** frontend and a **Node.js + Express + MongoDB** backend for visitor reviews.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ recommended  
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or update `MONGO_URI` to your Atlas connection string)

## Project layout

```
project/
├── client/           # Static frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/
│   ├── server.js
│   ├── models/Review.js
│   └── routes/reviewRoutes.js
├── .env
├── package.json
└── README.md
```

## Setup

1. **Clone or copy** this folder to your machine.

2. **Install dependencies** (from the project root):

   ```bash
   npm install
   ```

3. **Configure environment** — edit `.env` if needed:

   - `PORT` — HTTP port (default: `5000`)
   - `SKIP_MONGO` — set to `true` to run **without MongoDB**. The API still works, but reviews are kept **in memory only** and disappear when you stop the server. Useful while focusing on the frontend.
   - `MONGO_URI` — required when `SKIP_MONGO` is not `true`

4. **Start MongoDB** (skip this step if `SKIP_MONGO=true` in `.env`). Otherwise pick one:

   - **Docker (simplest if you have Docker Desktop):** from the project folder run:

     ```bash
     docker compose up -d
     ```

     This starts MongoDB on `localhost:27017`, matching the default `MONGO_URI` in `.env`.

   - **Local install:** install [MongoDB Community Server](https://www.mongodb.com/try/download/community), then start the **MongoDB** Windows service (Services app) or run `mongod` if it is on your `PATH`.

   - **Atlas:** create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), allow your IP, and put the SRV connection string in `.env` as `MONGO_URI=...`.

5. **Run the server**:

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

6. **Open the site** in a browser:

   [http://localhost:5000](http://localhost:5000)

   The same process serves the static `client/` files and the API at `/api/reviews`.

## API

All JSON responses use:

```json
{ "success": true|false, "data": ..., "message": "..." }
```

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/reviews` | List reviews, newest first |
| `POST` | `/api/reviews` | Body: `{ "name"?: string, "comment": string }` — `comment` required |

## Troubleshooting

### `ECONNREFUSED` / `127.0.0.1:27017`

The app cannot reach MongoDB. Start a database **before** `npm run dev`:

1. If you use Docker: `docker compose up -d`, wait a few seconds, then run `npm run dev` again.
2. If MongoDB is installed locally: ensure the **MongoDB** service is running (Windows: `services.msc` → MongoDB → Start).

## Notes

- The **dark mode** preference is stored in `localStorage` under `raghav-portfolio-theme`.

## License

MIT
