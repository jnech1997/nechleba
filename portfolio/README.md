# Portfolio front end

Angular 21 app (NgModule-based, esbuild `application` builder). See the root `README.md` for setup, environment variables and deployment.

- `npm start`: dev server on http://localhost:4200, proxies `/api` to the Node server on :4001 (`proxy.conf.json`)
- `npm run build`: production build into `dist/portfolio`
- `npm run test:ci`: unit tests in headless Chrome
- `npm run lint`: ESLint (flat config in `eslint.config.js`)

Translations are JSON files in `src/assets/i18n/`, loaded by ngx-translate.
