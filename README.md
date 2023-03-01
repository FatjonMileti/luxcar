# LuxCar Albania — Car Sales App (MERN + FastAPI)

A full-stack car sales application. https://luxcar.al/ — a car importer from South Korea to Albania and the Balkans.

The public site and API use the **MERN** stack (MongoDB, Express, React, Node.js with TypeScript), while the admin side pairs a **React** console with a **FastAPI** (Python) service sharing the same database. Everything is configured through **environment variables** (no hardcoded URLs, ports, or secrets).

## Tech Stack

| Layer         | Technology                                                              |
|---------------|-------------------------------------------------------------------------|
| Database      | MongoDB (shared by both backends; typed schemas: `ICar`, `IInquiry`)    |
| Public API    | Node.js, Express, TypeScript (`server/src`), `ts-node` / `tsc`          |
| Admin API     | Python, FastAPI + Motor (`admin-api/app`), JWT auth, port 8000          |
| Frontend      | React 18, React Router, Vite, TypeScript, Axios (`client/src`)          |
| Styling       | Plain CSS mimicking the luxcar.al dealer theme (dark + red accent)      |

## Project Structure

```
luxcar/
├── client/                  # React + Vite + TypeScript
│   ├── .env                 # VITE_* variables (gitignored, see .env.example)
│   ├── .env.example
│   ├── vite.config.ts       # reads VITE_BACKEND_URL for the /api proxy
│   ├── tsconfig.json
│   └── src/
│       ├── api.ts           # typed API client (Car, CarInput, Inquiry, FilterOptions)
│       ├── adminApi.ts      # typed FastAPI admin client (JWT, stats, CRUD)
│       ├── vite-env.d.ts    # VITE_API_URL / VITE_BACKEND_URL / VITE_ADMIN_API_URL typings
│       ├── main.tsx
│       ├── components/*.tsx # Navbar, Footer, CarCard, SearchBar, FinancingCalculator
│       └── pages/*.tsx      # Home, Cars, CarDetail, About, Services, Contact, Admin
├── server/                  # Express + Mongoose + TypeScript (public API, port 5000)
│   ├── .env                 # PORT, MONGO_URI, CLIENT_URL (gitignored, see .env.example)
│   ├── .env.example
│   ├── tsconfig.json
│   └── src/
│       ├── config.ts        # validated env variables (PORT, MONGO_URI, CLIENT_URL)
│       ├── server.ts        # Express bootstrap
│       ├── seed.ts          # demo data seeder (8 cars)
│       ├── models/Car.ts    # ICar interface + schema
│       ├── models/Inquiry.ts# IInquiry interface + schema
│       └── routes/*.ts      # typed cars / inquiries routers
├── admin-api/               # FastAPI admin service (port 8000, same MongoDB)
│   ├── .env                 # PORT, MONGO_URI, JWT_SECRET, ADMIN_* (gitignored, see .env.example)
│   ├── requirements.txt
│   └── app/
│       ├── config.py        # validated env variables
│       ├── db.py            # shared async MongoDB client (Motor)
│       ├── security.py      # bcrypt + JWT helpers
│       ├── schemas.py       # Pydantic models (Car, Inquiry, Stats, Auth)
│       ├── deps.py          # Bearer-token admin dependency
│       ├── serializers.py   # Mongo docs → API shapes (keeps `_id`)
│       ├── main.py          # app + CORS + admin bootstrap
│       └── routers/*.py     # auth, cars, inquiries, stats
└── README.md
```

## Environment Variables

### Backend (`server/.env`)

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/luxcar
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

All variables are loaded and validated in `server/src/config.ts`. `MONGO_URI` is required (falls back to local MongoDB).

### Frontend (`client/.env`)

```bash
VITE_API_URL=/api
VITE_BACKEND_URL=http://localhost:5000
VITE_ADMIN_API_URL=http://localhost:8000
```

- `VITE_API_URL` — base URL used by `src/api.ts` for all Axios requests.
- `VITE_BACKEND_URL` — target used by `vite.config.ts` for the dev `/api` proxy.
- `VITE_ADMIN_API_URL` — base URL used by `src/adminApi.ts` for the FastAPI admin service.

### Admin API (`admin-api/.env`)

```bash
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/luxcar   # SAME database as the Express API
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRE_MINUTES=720
ADMIN_EMAIL=admin@luxcar.al
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
```

Copy the examples to get started:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
cp admin-api/.env.example admin-api/.env
```

## Getting Started

### 1. Start MongoDB

```bash
mongod --dbpath /data/db
# or with Docker:
# docker run -d -p 27017:27017 mongo
```

### 2. Run the backend

```bash
cd server
npm install
npm run seed        # inserts 8 demo cars
npm run dev         # ts-node src/server.ts → http://localhost:5000/api/health
```

Other backend scripts:

```bash
npm run build       # tsc → dist/
npm start           # node dist/server.js (production)
npm run typecheck   # tsc --noEmit
```

### 3. Run the admin API (FastAPI)

```bash
cd admin-api
pip install -r requirements.txt
uvicorn app.main:app --port 8000   # → http://localhost:8000/health
```

On startup it creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if it
does not exist yet. Interactive docs: http://localhost:8000/docs.

### 4. Run the frontend

```bash
cd client
npm install
npm run dev         # vite → http://localhost:5173
```

Open http://localhost:5173/admin and log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD`
from `admin-api/.env` (default: `admin@luxcar.al` / `admin123`).

Other frontend scripts:

```bash
npm run build       # tsc -b && vite build
npm run preview     # preview the production build
npm run typecheck   # tsc --noEmit
```

The Vite dev server proxies `/api` to `VITE_BACKEND_URL`, so no CORS setup is needed locally.

## Features (mirrors luxcar.al)

- **Home**: hero + search bar (Year, Brand, Model, Mileage, Transmission, Inspected, Engine, Fuel, Price + “Search Cars” button), welcome section, 4-step order process, inspection checklist, featured cars grid.
- **Our Cars (`/cars`)**: inventory with sidebar filters, sorting (Name / Price / Date / Year), financing calculator.
- **Car details (`/cars/:id`)**: spec table, financing calculator, inquiry form, phone CTA (+355 696 269 999).
- **About, Services, Contact** pages (company info, RO-RO transport, contact form + map).
- **Admin (`/admin`)**: React console backed by the FastAPI service — JWT login,
  dashboard stats, car CRUD with search/status filters, inquiry inbox with
  status workflow (New → Read → Closed).

## API Reference

### Public API (Express, port 5000)

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | `/api/health`          | Health check                             |
| GET    | `/api/cars`            | List cars (filters, search, sort, paging)|
| GET    | `/api/cars/filters`    | Distinct values for the search bar       |
| GET    | `/api/cars/:id`        | Get one car                              |
| POST   | `/api/cars`            | Create a car (admin)                     |
| PUT    | `/api/cars/:id`        | Update a car (admin)                     |
| DELETE | `/api/cars/:id`        | Delete a car (admin)                     |
| GET    | `/api/inquiries`       | List contact inquiries                   |
| POST   | `/api/inquiries`       | Submit a contact / car inquiry           |
| DELETE | `/api/inquiries/:id`   | Delete an inquiry                        |

Filter query params: `brand, model, year, yearMin, yearMax, fuel, transmission, engine, inspected, priceMin, priceMax, mileageMax, search, sort, order, featured, status, page, limit`.

### Admin API (FastAPI, port 8000) — all `/admin/*` routes require `Authorization: Bearer <JWT>`

| Method | Endpoint                    | Description                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/health`                   | Health check                             |
| POST   | `/auth/login`               | Login with `{email, password}` → JWT     |
| GET    | `/auth/me`                  | Current admin profile                    |
| GET    | `/admin/stats`              | Dashboard counters + stock value         |
| GET    | `/admin/cars`               | List cars (`search`, `status`, paging)   |
| POST   | `/admin/cars`               | Create a car                             |
| PUT    | `/admin/cars/:id`           | Update a car                             |
| DELETE | `/admin/cars/:id`           | Delete a car                             |
| GET    | `/admin/inquiries`          | List inquiries (`status` filter)         |
| PATCH  | `/admin/inquiries/:id`      | Update inquiry status                    |
| DELETE | `/admin/inquiries/:id`      | Delete an inquiry                        |
