# Rose Glow Salon

## Overview
Web application for salon booking that allows users to register, login, and book appointments.

---

## Technologies
- React
- TypeScript
- Vite
- Node.js
- Express.js
- MongoDB Atlas

---

## Database

### users
- id
- name
- email
- passwordHash
- createdAt

### bookings
- id
- userEmail
- service
- specialist
- date
- time
- payment
- reminderStatus
- createdAt

---

## API

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Bookings
- GET /api/bookings
- POST /api/bookings
- DELETE /api/bookings/:id

---

## Flowchart


![Flowchart](screenshots/Flowchart.jpg)

## Screenshots
- Home Page
- Services Page
- Login Page
- Register Page
- Booking Page
- MongoDB Collections

---

## Future Improvements
- Admin dashboard
- Notifications
- Online payment system




