# LuxCar Albania — MERN Car Sales App (TypeScript)

A full-stack MERN application for selling cars, inspired by https://luxcar.al/ — a car importer from South Korea to Albania and the Balkans.

Both the backend and frontend are written in **TypeScript** and configured entirely through **environment variables** (no hardcoded URLs, ports, or secrets).

## Tech Stack

| Layer    | Technology                                                              |
|----------|-------------------------------------------------------------------------|
| Database | MongoDB + Mongoose (typed schemas: `ICar`, `IInquiry`)                  |
| Backend  | Node.js, Express, TypeScript (`server/src`), `ts-node` / `tsc`          |
| Frontend | React 18, React Router, Vite, TypeScript, Axios (`client/src`)          |
| Styling  | Plain CSS mimicking the luxcar.al dealer theme (dark + red accent)      |

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
│       ├── vite-env.d.ts    # VITE_API_URL / VITE_BACKEND_URL typings
│       ├── main.tsx
│       ├── components/*.tsx # Navbar, Footer, CarCard, SearchBar, FinancingCalculator
│       └── pages/*.tsx      # Home, Cars, CarDetail, About, Services, Contact, Admin
├── server/                  # Express + Mongoose + TypeScript
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
```

- `VITE_API_URL` — base URL used by `src/api.ts` for all Axios requests.
- `VITE_BACKEND_URL` — target used by `vite.config.ts` for the dev `/api` proxy.

Copy the examples to get started:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
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

### 3. Run the frontend

```bash
cd client
npm install
npm run dev         # vite → http://localhost:5173
```

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
- **Admin (`/admin`)**: typed car CRUD table + incoming inquiries list.

## API Reference

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
