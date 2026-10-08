# 🚚 LogiTrack – Logistics & Courier Management
https://logistics-courier-management-projec-two.vercel.app/
A React + Vite web app with a `json-server` fake backend. It now supports **two roles**:
**Admin** and **User**, with role-based pages and permissions.

## Run it (3 steps)

Requirements: Node.js 18+ (https://nodejs.org)

```bash
npm install          # 1. install packages (first time only)
npm run dev:all      # 2. starts backend (port 3000) + frontend (port 5173) together
                     # 3. open http://localhost:5173
```

Prefer two terminals? Run `npm run server` in one and `npm run dev` in the other.

## Demo accounts

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@logitrack.com  | admin123  |
| User  | user@logitrack.com   | user123   |

Anyone who uses **Signup** becomes a normal *User*. An admin can promote them on the **Users** page.

## What each role can do

| Feature                              | Public | User            | Admin |
|--------------------------------------|:------:|:---------------:|:-----:|
| Track by tracking ID (`/track`)      | ✅     | ✅              | ✅    |
| Sign up / log in                     | ✅     | ✅              | ✅    |
| Dashboard                            | –      | own data only   | all data + user count |
| View shipments                       | –      | own only        | all   |
| Book / add a shipment                | –      | ✅ (status = Pending) | ✅ (can assign to any customer) |
| Edit / cancel a shipment             | –      | own, only while Pending | any |
| Change delivery status               | –      | ❌              | ✅    |
| Manage users (promote, delete)       | –      | ❌              | ✅    |

## Project structure

```
src/
  Services/api.js        axios instance (URL from .env files)
  Services/auth.js       session + permission helpers (canView, canModify, isAdmin)
  Services/helpers.js    small helpers
  routes/approutes.jsx   public / logged-in / admin-only routes
  components/            Navbar, ShipmentCard, ShipmentForm, ProtectedRoute (role aware)
  pages/                 home, login, signup, dashboard, shipment, shipmentdetails,
                         addshipment, editshipment, track (new), users (new)
db.json                  users (with role) and shipments (with userId / createdBy)
run-all.js               starts json-server + vite together
```

## API URL

* `npm run dev`  → `.env.development` → `http://localhost:3000`
* `npm run build` → `.env.production` → your Render URL (edit the file if it changes)

To deploy the new roles, redeploy the backend (`npm start` = json-server) with this new `db.json`.

## Important note (for viva / report)

This is a learning project. Roles are enforced in the **frontend** and `json-server` has no real
authentication, and passwords are stored as plain text. A production app would use a real backend
with hashed passwords (bcrypt) and JWT tokens, and check the role on the server for every request.
