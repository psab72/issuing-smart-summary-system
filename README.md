# IssueOps — Issue Intake & Smart Summary System

A production-grade issue tracking system built with **Laravel 12** (backend/API) and **React 18** (frontend SPA), featuring AI-powered summaries via the Claude API with automatic rules-based fallback.

---

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+ and npm
- MySQL (recommended) or SQLite
- (Optional) Laravel Valet

---

## Quick Start

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Set your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=issuing_smart_summary_system
DB_USERNAME=root
DB_PASSWORD=
```

Optionally, add your Gemini API key to enable AI summaries:

```env
GEMINI_API_KEY=AIzaSyBgJolbgPB0Wbfqtv0TirNe3Uxa0rgRhe4
```

> Without this key the system falls back to deterministic rules-based summaries automatically.

### 3. Set up the database

```bash
php artisan migrate --seed
```

### 4. Enable API routes (Laravel 12)

In `bootstrap/app.php`, ensure `api` is included in `withRouting(...)`:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

Then clear all caches:

```bash
php artisan optimize:clear
```

### 5. Start the app

Run the Vite dev server:

```bash
npm run dev
```

Then start the backend using one of the following:

**Artisan serve**
```bash
php artisan serve
```
Open: [http://127.0.0.1:8000](http://127.0.0.1:8000)

**Laravel Valet**
```bash
valet link
```
Open: [http://issuing-smart-summary-system.test](http://issuing-smart-summary-system.test)

---

## Frontend (Tailwind CSS)

This project uses **Tailwind CSS v3** with PostCSS.

`postcss.config.js` should contain:

```js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

If the build fails due to missing packages, run:

```bash
npm install -D tailwindcss@^3.4 postcss autoprefixer
```

---

## API Reference

All endpoints are prefixed with `/api/issues`.

### `GET /api/issues/stats`
Returns aggregate counts for the dashboard.

### `GET /api/issues`
Returns a paginated, filterable list of issues.

| Param | Values |
|---|---|
| `status` | `open`, `in_progress`, `resolved`, `closed` |
| `priority` | `low`, `medium`, `high`, `critical` |
| `category` | `bug`, `feature`, `infrastructure`, `security`, `performance`, `other` |
| `escalated` | `1` |
| `search` | Free text (matches title + description) |
| `per_page` | Integer (default: `20`) |

### `POST /api/issues`
Creates a new issue. Automatically triggers summary generation and escalation evaluation.

```json
{
  "title": "Database connection pool exhausted",
  "description": "The primary DB pool is hitting 200 connections at peak hours...",
  "priority": "critical",
  "category": "infrastructure",
  "reporter_name": "Jane Dev",
  "reporter_email": "jane@example.com",
  "due_at": "2024-04-01T18:00:00Z"
}
```

### `GET /api/issues/{id}`
Retrieves a single issue by ID.

### `PATCH /api/issues/{id}`
Partially updates an issue. If `title`, `description`, `priority`, or `category` changes, the AI summary is regenerated automatically.

### `DELETE /api/issues/{id}`
Deletes an issue.

### `POST /api/issues/{id}/regenerate-summary`
Force-regenerates the AI summary and suggested action for an issue.

---

## Troubleshooting

### 1. `POST /api/issues` returns "method not supported"
**Cause:** `routes/api.php` is not being loaded.

**Fix:** Add `api:` to `withRouting(...)` in `bootstrap/app.php` (see Step 4 above), then run:

```bash
php artisan optimize:clear
php artisan route:list
```

### 2. Vite build fails — cannot resolve `axios`

```bash
npm install axios
```

### 3. Rollup imports `app.js` instead of `App.jsx`
Use the explicit extension in `resources/js/index.jsx`:

```js
import App from './App.jsx';
```

### 4. Valet site throws 500 — `class [view] does not exist`
Ensure `app/Providers/AppServiceProvider.php` exists, then run:

```bash
composer dump-autoload
php artisan optimize:clear
valet restart
```

### 5. 404 errors — wrong URL
- **Artisan serve:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Valet:** [http://issuing-smart-summary-system.test](http://issuing-smart-summary-system.test)

---

## Architecture Notes

| Layer | Details |
|---|---|
| **Backend** | Laravel 12 · REST API · Form Request validation · Service layer |
| **Frontend** | React 18 SPA · Vite · Tailwind CSS v3 |
| **AI Service** | Claude API (`claude-sonnet-4-20250514`) · deterministic rules-based fallback |
| **Escalation** | Re-evaluated on every create and update to keep flags current |
| **Database** | MySQL recommended for local parity with production; SQLite supported |
