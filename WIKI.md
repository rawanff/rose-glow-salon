# Wiki - Rose Glow Salon

## Role: Database & Documentation

---

## Database Setup
- Used MongoDB Atlas as the database
- Connected backend using Mongoose
- Created two main collections:
  - users
  - bookings

---

## Models

### User Model
- id
- name
- email
- passwordHash
- createdAt

### Booking Model
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

## Backend Integration
- Connected Express server to MongoDB
- Implemented authentication (register/login)
- Implemented booking system (create, read, delete)

---

## Documentation Work
- Prepared README file
- Created flowchart of system
- Prepared screenshots of application
- Documented API routes

---

## Summary
This project is fully connected to MongoDB Atlas and supports full CRUD operations for user authentication and bookings.