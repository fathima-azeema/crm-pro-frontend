# CRM Pro – Full‑Stack Customer Relationship Management

[![Live Demo](https://img.shields.io/badge/Live_Demo-View-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://crm-pro-frontend.vercel.app)
[![Frontend Repo](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github)](https://github.com/fathima-azeema/crm-pro-frontend)
[![Backend Repo](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github)](https://github.com/fathima-azeema/crm-pro-backend)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/fathima-azeema)

A full‑stack, production‑ready CRM built with Next.js, Express, and Supabase.  
Replace spreadsheets with a modern workspace – manage customers, leads, tasks, employees, and reports from one beautiful interface.  

**Live and ready to demo.** Built as a portfolio project to showcase end‑to‑end software engineering.

---

## 🚀 Live Demo

**[crm-pro-frontend.vercel.app](https://crm-pro-frontend.vercel.app)**  

**Demo credentials**  
- Email: `admin@crm.com`  
- Password: `Admin@123`  

*(If the password has been changed, you can register a new account or check the repo for the latest demo credentials.)*

---

## ✨ Highlights

- Drag‑and‑drop **Kanban boards** for leads and tasks
- **Real‑time dashboard** with animated KPI cards, sparkline charts, and interactive graphs
- **Global command palette** (`Ctrl+K`) – search customers, leads, and tasks instantly
- **JWT authentication** with role‑based access (Admin / Sales Executive)
- **Full customer lifecycle** – notes, follow‑ups, and lead‑to‑customer conversion
- **Calendar** showing follow‑ups and task deadlines
- **Employee management** with CRUD, search, and pagination
- **Dark / light theme** with system‑preference detection
- **Responsive** layout, collapsible sidebar, and micro‑interactions
- Deployed on **Vercel + Render + Supabase** (free tier)

---

## 📋 Feature Modules

| Section          | Content |
|------------------|---------|
| Authentication   | Register, login, JWT, protected routes, change password, update profile |
| Dashboard        | Animated stat cards, sparkline charts, customer growth, leads by status, recent activity, quick actions |
| Customers        | Full CRUD, search, filter, pagination, detail tabs (info, notes, follow‑ups) |
| Leads            | Kanban board with drag‑and‑drop status update, lead source, conversion pipeline |
| Tasks            | Kanban + list view, assignment, priority, due dates, drag‑and‑drop status |
| Calendar         | Monthly grid with follow‑ups and tasks, click‑to‑view day events |
| Reports          | Customer growth line chart, leads by status pie chart, tasks by status bar chart |
| Employees        | Table with search, pagination, add / edit / delete dialogs (admin only) |
| Settings         | Profile, password, company name (DB‑persisted), appearance (theme toggle) |
| Command Palette  | Global `Ctrl+K` search across customers, leads, and tasks |

---

## 💻 Technology Stack

| Layer               | Technologies |
|---------------------|--------------|
| **Frontend**        | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, dnd‑kit |
| **Backend**         | Node.js, Express.js, Knex.js, JWT, bcrypt |
| **Database**        | Supabase (PostgreSQL) |
| **State management**| React Query (TanStack Query), React Context |
| **Validation**      | Zod, React Hook Form |
| **Deployment**      | Vercel (frontend), Render (backend), Supabase (database) |
| **Version control** | Git, GitHub |

---

## 📁 Project Structure

```text
crm-pro/
├── client/                    # Next.js frontend
│   ├── public/
│   ├── src/
│   │   ├── app/               # App Router pages (routes)
│   │   ├── components/        # Reusable UI (sidebar, dashboard, kanban, command…)
│   │   ├── providers/         # Auth, Theme, React Query providers
│   │   ├── lib/               # API client (Axios), utilities
│   │   └── hooks/             # Custom hooks
│   ├── .env.local
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── server/                    # Express backend
    ├── src/
    │   ├── controllers/       # Business logic (auth, customers, leads…)
    │   ├── routes/            # API route definitions
    │   ├── middleware/        # JWT authentication & role checks
    │   ├── config/            # Database connection (Knex)
    │   └── server.js
    ├── .env
    └── package.json 

## 🛠️ Run Locally

### 1. Clone the repositories


git clone https://github.com/fathima-azeema/crm-pro-frontend.git
git clone https://github.com/fathima-azeema/crm-pro-backend.git

2. Backend setup
cd crm-pro-backend
npm install

env
PORT=5000
DATABASE_URL=your_supabase_session_pooler_url
JWT_SECRET=your_jwt_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
Start the server:

bash
npm run dev
The API will be available at http://localhost:5000.

3. Frontend setup
bash
cd ../crm-pro-frontend
npm install
Create a .env.local file in the client folder with:

env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Start the development server:

bash
npm run dev
Open http://localhost:3000.

🌍 Deployment
The application is already deployed, but you can deploy your own instance.

Frontend (Vercel)
Push the crm-pro-frontend repo to GitHub.

Import the project on Vercel.

Set the environment variable NEXT_PUBLIC_API_URL to your backend URL (e.g., https://your-api.onrender.com/api).

Deploy – Vercel will automatically build and serve your app.

Backend (Render)
Push the crm-pro-backend repo to GitHub.

Create a new Web Service on Render.

Set the Start Command to node src/server.js.

Add the same environment variables as in your local .env.

Deploy – after a few minutes your API will be live.

Database (Supabase)
The database is already hosted on Supabase.

Use the Session pooler connection string for Render (IPv4 compatibility).

Run the provided SQL script to create all necessary tables.

🔐 Environment Variables
Backend (server/.env)
Variable	Description
PORT	Server port (Render assigns its own)
DATABASE_URL	Supabase PostgreSQL connection string (session pooler)
JWT_SECRET	Secret key for signing JWT tokens
SUPABASE_URL	Your Supabase project URL
SUPABASE_SERVICE_KEY	Supabase service role key
Frontend (client/.env.local)
Variable	Description
NEXT_PUBLIC_API_URL	Base URL of the backend API (e.g., https://your-api.onrender.com/api)
📝 Customize
Branding: Replace the “CP” logo in components/layouts/sidebar.tsx with your own.

Company Name: Change the company name in the settings page (it reads from the settings table).

Demo Data: Seed the database with your own sample customers, leads, and tasks.

UI Theme: The theme uses shadcn/ui design tokens – you can customise colours in globals.css.

📄 License
This project is open source under the MIT License.

🙌 Credits
Designed, developed, and deployed by Fathima Azeema.
