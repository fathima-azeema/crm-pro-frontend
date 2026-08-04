# CRM Pro – Full-Stack Customer Relationship Management

[![Live Demo](https://img.shields.io/badge/Live_Demo-View-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://crm-pro-frontend.vercel.app)
[![Frontend GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github)](https://github.com/fathima-azeema/crm-pro-frontend)
[![Backend GitHub](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github)](https://github.com/fathima-azeema/crm-pro-backend)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/fathima-azeema/)

A full‑stack, production‑ready CRM built with Next.js, Express, and Supabase. It replaces spreadsheets with a modern workspace – manage customers, leads, tasks, employees, and reports from one beautiful interface.

The application is live and ready to demo. It was designed as a portfolio project to demonstrate end‑to‑end software engineering skills.

---

## 🚀 Live Demo

**[crm-pro-frontend.vercel.app](https://crm-pro-frontend.vercel.app)**

**Demo Account**  
- **Email:** `admin@crm.com`  
- **Password:** `Admin@123`

(*The password may change – please refer to the live site for the current demo credentials*)

---

## ✨ Highlights

- Drag‑and‑drop Kanban boards for leads and tasks
- Real‑time dashboard with animated KPI cards and interactive charts
- Global command palette (`Ctrl + K`) to instantly search customers, leads, and tasks
- Role‑based authentication (Admin / Sales Executive) with JWT and bcrypt
- Full customer lifecycle: notes, follow‑ups, and conversion from leads
- Calendar view showing follow‑ups and task due dates
- Employee management with search, pagination, and inline CRUD
- Dark / light theme with system preference detection
- Responsive layout with collapsible sidebar and micro‑interactions
- Deployed on Vercel + Render + Supabase (free tier)

---

## 📋 Feature Modules

| Section | Content |
| --- | --- |
| Authentication | Register, login, JWT, protected routes, change password, update profile |
| Dashboard | Animated stat cards, sparkline charts, customer growth, leads by status, recent activities, quick actions |
| Customers | Full CRUD, search, filter, pagination, detail tabs (info, notes, follow‑ups) |
| Leads | Kanban board with drag‑and‑drop status update, lead source, conversion pipeline |
| Tasks | Kanban + list view, assignment, priority, due dates, drag‑and‑drop status |
| Calendar | Monthly grid with follow‑ups and tasks, click‑to‑view events |
| Reports | Customer growth line chart, leads by status pie chart, tasks by status bar chart |
| Employees | Table with search, pagination, add/edit/delete dialogs (admin only) |
| Settings | Profile, password, company name (database persisted), appearance (theme toggle) |
| Command Palette | Global `⌘K` / `Ctrl+K` search across customers, leads, and tasks |

---

## 💻 Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, dnd‑kit |
| **Backend** | Node.js, Express.js, Knex.js, JWT, bcrypt |
| **Database** | Supabase (PostgreSQL) |
| **State Management** | React Query (TanStack Query), React Context |
| **Validation** | Zod, React Hook Form |
| **Deployment** | Vercel (frontend), Render (backend), Supabase (database) |
| **Version Control** | Git, GitHub |

---

## 📁 Project Structure
crm-pro/
├── client/ # Next.js frontend
│ ├── src/
│ │ ├── app/ # App Router pages (dashboard, customers, leads…)
│ │ ├── components/ # Reusable UI (sidebar, dashboard, kanban, command…)
│ │ ├── providers/ # Auth, Theme, React Query providers
│ │ ├── lib/ # API client (Axios), utilities
│ │ └── hooks/ # Custom hooks
│ └── public/
│
└── server/ # Express backend
├── src/
│ ├── controllers/ # Business logic (auth, customers, leads…)
│ ├── routes/ # Route definitions
│ ├── middleware/ # JWT authentication, role checks
│ └── config/ # Database connection (Knex)
└── package.json

---

## 🛠️ Run Locally

### 1. Clone the repositories

```bash
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
