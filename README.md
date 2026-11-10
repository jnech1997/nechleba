# nechleba

Source for https://www.josephnechleba.com: an Express + MongoDB API that also serves the Angular single-page app in `portfolio/`. Deployed on Heroku.

## Layout

| Path | What |
| --- | --- |
| `index.js` | Entry point: connects to MongoDB and starts the HTTP server |
| `app.js` | Express app: security headers (helmet/CSP), compression, static files, `/api`, SPA fallback, error handler |
| `routes/api.js` | API routes |
| `controllers/` | Auth (JWT access token + httpOnly refresh cookie), Pokémon teams, contact email |
| `middleware/` | `auth.js` (Bearer token check), `rateLimit.js` |
| `models/` | Mongoose models |
| `test/` | API tests (`node:test`, no database needed) |
| `portfolio/` | Angular 21 front end |

## Requirements

- Node 22 (see `engines` in `package.json`)
- MongoDB (local `mongod` or Atlas)

## Environment variables (`.env`, never committed)

| Name | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `TOKEN_KEY` | Secret for 15-minute access tokens |
| `REFRESH_TOKEN_KEY` | Secret for 7-day refresh tokens (must differ from `TOKEN_KEY`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP account for the contact form |
| `TO_EMAIL` | Where contact-form messages are sent |
| `PORT` / `API_PORT` | HTTP port (default 4001; Heroku sets `PORT`) |

Generate strong secrets with:

```sh
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Development

```sh
npm install                      # API dependencies
(cd portfolio && npm install)    # front-end dependencies; postinstall runs a production build
npm run dev                      # API on :4001 with nodemon; also serves portfolio/dist
(cd portfolio && npm start)      # Angular dev server on :4200, proxies /api to :4001
```

## Tests and lint

```sh
npm test                          # API tests
cd portfolio && npm run test:ci   # Angular unit tests (headless Chrome)
cd portfolio && npm run lint      # ESLint
```

## Deploy

Heroku runs `heroku-postbuild` (`cd portfolio && npm ci`), which builds the Angular app into `portfolio/dist/portfolio`. `Procfile` starts `node index.js`.
