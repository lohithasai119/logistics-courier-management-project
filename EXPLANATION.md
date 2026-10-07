# How to explain LogiTrack (English script + viva answers)

## 1. 30-second introduction
"LogiTrack is a logistics and courier management web application. Customers can book and track
their shipments, and an admin manages the whole operation. It is built with React and Vite on the
frontend, React Router for navigation, Axios for API calls, and json-server as a REST backend.
The main feature I added is **role-based login**: Admin and User see different pages and have different permissions."

## 2. 3-minute walkthrough (what to click while speaking)
1. **Home page** – "This is the landing page. It explains the features and the two roles. Anyone can also track a parcel without logging in."
2. **Track page** – type `TRK1001`. "A public user can see only the status, route and courier. Private details like names and price are hidden."
3. **Signup** – "A new account always gets the *User* role. A user cannot make themselves admin."
4. **Login as User** (`user@logitrack.com` / `user123`) – "After login the role is saved in localStorage. The navbar shows *My Shipments* and *Book*, no *Users* menu."
5. **My Shipments** – "The app asks the server only for shipments where `userId` equals my id, so I see only my own shipments."
6. **Book a shipment** – "Tracking ID is auto-generated and status is forced to *Pending*. A user cannot choose a status."
7. **Edit / Cancel** – "Allowed only while the shipment is Pending. After the admin moves it to In Transit the buttons disappear."
8. **Logout → Login as Admin** (`admin@logitrack.com` / `admin123`) – "Admin sees all shipments, extra dashboard stats, and a *Users* menu."
9. **Update status** – open a shipment → click In Transit / Delivered. "Only the admin can move a shipment through the delivery stages."
10. **Users page** – "Admin can promote a user to admin, demote, or delete a user."
11. **Try forbidden access** – log in as user and open `/users` → redirected to dashboard. Open another user's shipment URL → "Access denied".

## 3. How the role system works (technical explanation)
* Each user in `db.json` has a `role`: `"admin"` or `"user"`. Each shipment has `userId` (owner) and `createdBy`.
* On login, `saveSession()` stores `{ id, name, email, role }` in localStorage.
* `ProtectedRoute` checks the session; `<ProtectedRoute role="admin" />` guards admin-only pages.
* Two small functions in `Services/auth.js` hold the rules:
  * `canView(shipment)` → admin, or the owner.
  * `canModify(shipment)` → admin, or the owner while status is Pending.
* Pages call `canView` / `canModify` to show or hide buttons, and also to block direct URL access.
* The Navbar, Dashboard and Shipments list change based on `user.role`.

## 4. Likely viva questions and short answers
**Q: What is the difference between Admin and User?**
Admin manages everything (all shipments, status updates, users). A user only books and manages their own pending shipments.

**Q: How does login work?**
The login page queries `/users?email=...`, compares the password, and saves the user and role in localStorage. Logout clears it.

**Q: How do you protect admin pages?**
With a role-aware `ProtectedRoute`. If a normal user opens `/users`, they are redirected to the dashboard.

**Q: How does a user see only their own shipments?**
The API call is `GET /shipments?userId=<my id>`; json-server filters by that field.

**Q: Can a user change their status or role by editing the form?**
No. On save, the code overrides `status`, `userId` and `role` for normal users.

**Q: Is this secure enough for production?**
No, and I know why: json-server has no real authentication, passwords are plain text, and checks are in the frontend. In production I would use Node/Express (or Django) with bcrypt-hashed passwords, JWT tokens and server-side role checks.

**Q: Why json-server?**
It gives a complete REST API from a single JSON file, so I could focus on the React frontend.

**Q: Why React Router and what are protected routes?**
React Router provides client-side navigation without page reloads. Protected routes wrap pages and redirect when the user is not logged in or lacks the role.

**Q: What are the future improvements?**
Real backend with JWT, password hashing, email/SMS notifications, live map tracking, payment integration, delivery-agent role.
