# Employee Management System

A full-stack Employee Management system with a ReactJS and Ant Design frontend, an Express and TypeScript backend, and Microsoft SQL Server for persistence. Authenticated users can create, read, update, and delete employees and view a simple department salary report.

## Prerequisites

- Node.js 18 or later
- Docker Desktop (for running SQL Server locally)

## Setup

### 1. Start SQL Server with Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=MyExam2026!" -p 1433:1433 --name mssql-exam -d mcr.microsoft.com/mssql/server:2022-latest
```

Wait about 20–30 seconds for the container to finish starting.

### 2. Create the database and schema

Connect to the server (SA password from the Docker command above), create the database, then run the schema script against `exam_db` (not `master`):

```sql
CREATE DATABASE exam_db;
```

Then run [`database/setup.sql`](database/setup.sql) while connected to `exam_db`.

**VS Code MSSQL extension:** Connect to the server, set the database to `exam_db`, open `database/setup.sql`, and use Run Query.

**sqlcmd example:**

```bash
sqlcmd -S localhost,1433 -U sa -P "MyExam2026!" -Q "CREATE DATABASE exam_db"
sqlcmd -S localhost,1433 -U sa -P "MyExam2026!" -d exam_db -i database/setup.sql
```

### 3. Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set `DB_PASSWORD` to the SA password you used for Docker. Keep `DB_DATABASE=exam_db` and set a `JWT_SECRET`.

```bash
npm install
npx ts-node-dev --transpile-only src/seed.ts
npm run dev
```

Seed creates the default login: **admin** / **admin123**. Run the seed once only (username is unique). Backend listens on port **5000**.

### 4. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`), then log in with `admin` / `admin123`.

## API Endpoints

- `POST /api/auth/login` — login, returns JWT
- `GET /api/employees` — list employees
- `GET /api/employees/:id` — get one employee
- `POST /api/employees` — create employee
- `PUT /api/employees/:id` — update employee
- `DELETE /api/employees/:id` — delete employee
- `GET /api/employees/report/summary` — department report (count, total salary, average salary)
- `GET /api/employees/report/pdf` — download department report as PDF

All employee routes require `Authorization: Bearer <token>`.

## Challenges encountered

Azure Data Studio is being retired, so I switched to the VS Code MSSQL extension for running queries. Installing TypeScript without a version pinned pulled TypeScript 7, which broke `ts-node-dev`, so I pinned the backend to `typescript@5.6.3`. I also had to be careful to run `setup.sql` against `exam_db` instead of the default `master` database in the MSSQL extension.
