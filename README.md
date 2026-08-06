# CRM Pro — Full-Stack Customer Relationship Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-View-3B82F6?style=for-the-badge&logo=vercel&logoColor=white)](https://crm-pro-frontend.vercel.app)
[![Frontend Repository](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github)](https://github.com/fathima-azeema/crm-pro-frontend)
[![Backend Repository](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github)](https://github.com/fathima-azeema/crm-pro-backend)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fathima_Azeema-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/fathima-azeema)

A modern, production-ready Customer Relationship Management (CRM) platform built with **Next.js**, **Express.js**, and **Supabase PostgreSQL**. CRM Pro enables businesses to manage customers, leads, employees, tasks, reports, and business activities from a single responsive dashboard.

The application is built using modern web technologies with a scalable frontend-backend architecture and demonstrates full-stack software engineering, authentication, database management, REST API development, and responsive UI design.

---

## 🌐 Live Demo

**https://crm-pro-frontend.vercel.app**

### Demo Account

**Email:** `admin@crm.com`

**Password:** `Admin@123`

> If the password has changed, create a new account or update the demo credentials from the repository.

---

# ✨ Highlights

- JWT Authentication with secure login and registration
- Role-based access control (Admin & Sales Executive)
- Interactive analytics dashboard with KPI cards and charts
- Drag-and-drop Kanban boards for Leads and Tasks
- Customer management with notes and follow-ups
- Lead conversion workflow
- Employee management module
- Calendar with task and follow-up scheduling
- Global Command Palette (`Ctrl + K`)
- Dark & Light themes with persistent preferences
- Responsive desktop, tablet, and mobile layouts
- Built using Next.js App Router and Express REST API
- PostgreSQL database powered by Supabase
- Deployed using Vercel, Render, and Supabase

---

# 📋 Feature Modules

| Module | Description |
|---------|-------------|
| Authentication | Register, Login, JWT Authentication, Protected Routes, Profile Update, Password Change |
| Dashboard | KPI Cards, Customer Growth, Sales Charts, Recent Activity, Quick Actions |
| Customers | Create, Read, Update, Delete, Search, Filter, Pagination, Notes & Follow-ups |
| Leads | Kanban Board, Drag & Drop Status Updates, Lead Sources, Conversion Pipeline |
| Tasks | Kanban View, List View, Priority Levels, Due Dates, Assignment |
| Calendar | Monthly Calendar with Tasks and Follow-ups |
| Reports | Customer Growth, Lead Status, Task Analytics |
| Employees | Employee CRUD, Search, Pagination (Admin Only) |
| Settings | Company Information, User Profile, Theme Settings |
| Command Palette | Global Search using `Ctrl + K` |

---

# 💻 Technology Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Recharts
- dnd-kit
- React Hook Form
- Zod
- TanStack React Query

### Backend

- Node.js
- Express.js
- Knex.js
- JWT Authentication
- bcrypt

### Database

- Supabase PostgreSQL

### Deployment

- Vercel (Frontend)
- Render (Backend)
- Supabase (Database)

### Tools

- Git
- GitHub
- VS Code
- Postman

---

# 📁 Project Structure

```text
crm-pro/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── providers/
│   │   └── styles/
│   ├── package.json
│   └── next.config.ts
│
└── server/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   └── server.js
    └── package.json
```

---

# 🚀 Run Locally

## 1. Clone the repositories

```bash
git clone https://github.com/fathima-azeema/crm-pro-frontend.git
git clone https://github.com/fathima-azeema/crm-pro-backend.git
```

---

## 2. Backend Setup

```bash
cd crm-pro-backend
npm install
```

Create a `.env` file.

```env
PORT=5000

DATABASE_URL=your_supabase_session_pooler_url

JWT_SECRET=your_jwt_secret

SUPABASE_URL=https://your-project.supabase.co

SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

Start the backend server.

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## 3. Frontend Setup

```bash
cd ../crm-pro-frontend
npm install
```

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend.

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 🌍 Deployment

## Frontend (Vercel)

1. Push the frontend repository to GitHub.
2. Import the repository into Vercel.
3. Configure:

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

4. Deploy.

---

## Backend (Render)

1. Push the backend repository to GitHub.
2. Create a new Render Web Service.
3. Set the start command.

```bash
node src/server.js
```

4. Add all backend environment variables.
5. Deploy.

---

## Database (Supabase)

- Create a Supabase PostgreSQL project.
- Use the Session Pooler connection string.
- Run the SQL migration scripts.
- Configure the connection string in Render.

---

# 🔐 Environment Variables

## Backend (`.env`)

| Variable | Description |
|----------|-------------|
| PORT | Backend server port |
| DATABASE_URL | Supabase PostgreSQL Session Pooler URL |
| JWT_SECRET | Secret used for JWT authentication |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_SERVICE_KEY | Supabase Service Role Key |

---

## Frontend (`.env.local`)

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Backend API URL |

---

# 🛠 Customization

### Branding

Replace the CRM logo located in:

```
components/layouts/sidebar.tsx
```

---

### Company Information

Update company details from the **Settings** module.

---

### Sample Data

Populate the database with your own:

- Customers
- Leads
- Tasks
- Employees

---

### Theme

Customize colors inside:

```
globals.css
```

using Tailwind and shadcn/ui design tokens.

---

# 📄 License

This project is licensed under the **MIT License**.

---

## 👩‍💻 Developer

Designed, developed, and deployed by **Fathima Azeema**

- GitHub: https://github.com/fathima-azeema
- LinkedIn: https://linkedin.com/in/fathima-azeema

---

⭐ If you found this project helpful, consider giving the repositories a star.
