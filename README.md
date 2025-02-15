# Hospital Backend System

A comprehensive backend for hospital management built with Node.js, Express, and TypeScript, using MongoDB for data storage. The system supports user authentication, doctor-patient assignments, note/task management with LLM integration, dynamic scheduling of patient reminders, and more.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)
- [Models Documentation](#models-documentation)
- [Design & Justification](#design--justification)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **User Management:** Signup, login with JWT, and role-based access.
- **Doctor-Patient Assignments:** Patients choose doctors; doctors view their assigned patients.
- **Notes & Tasks:** Doctors create notes processed via LLM to extract actionable steps (checklist, plan, etc.). Reminders are dynamically scheduled.
- **Containerized Deployment:** Docker multi-stage builds for lightweight production images.

---

## Technologies

- **Backend:** Node.js, Express, TypeScript  
- **Database:** MongoDB (via Mongoose)  
- **Authentication:** JWT (HTTP-only cookies), bcrypt  
- **Scheduling:** Background jobs (Bull/node-cron recommended)  
- **Containerization:** Docker (using Node 22 and Node 22-alpine)

---


## Installation

1. **Clone the Repository:**

```bash
   git clone https://github.com/punixcorn/Hospital-Backend-System-Test-001
   cd Hospital-Backend-System-Test-001
```
2. **Install Dependencies:**

```bash
npm install
```

3. **Environment Variables:**
Create a **.env** file in the root directory with at least:

```ini
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
PORT=3000
GEMINI_API=gemini api key
```
###### note: one already exists in this repo, and the gemini key is free but rate limited so it may fail with "too many requests" sometimes
4. **Running the Application**

```bash
npm run dev
```
---

# API Endpoints
### Authentication (src/api/auth)
- POST /api/auth/signup: Register a new user.
- POST /api/auth/login: Authenticate and obtain a JWT.
### Doctor (src/api/doctor)
- GET /api/doctor/get-patients: Retrieve patients assigned to the doctor.
- POST /api/doctor/select-patient: Send a note to a patient (note processed via LLM).
### Patient (src/api/patient)
- GET /api/patient/available-doctors: List available doctors.
- POST /api/patient/select-doctor: Choose a doctor (updates Assignment).
### Notes (src/api/notes)
- POST /api/notes/add_note_task: Doctor creates a note for a patient with LLM-extracted actions.
- GET /api/notes/get_my_tasks: Patient retrieves active tasks (where is_done is false).

### Models Documentation
#### User Model:
Stores all users with email, hashed password, role (doctor/patient), and verification status.

#### Assignment Model:
Maps a doctor to multiple patients. Patients selecting a doctor update this model.

#### Note Model:
Stores doctor notes for patients, including the original note, LLM-extracted actions (checklist, plan, number_of_days, interval_between_days), and task lifecycle fields (number_of_days_left, is_done, remind_patient_today).

#### Session Model:
Tracks active user sessions for authentication and immediate revocation.

#### Verification Model:
Manages user verification codes and their statuses.
---

# Design & Justification
### Authentication:

Uses JWT for stateless, scalable auth.
Role-based access (via role field) ensures proper endpoint restrictions.

### Encryption:

Passwords hashed with bcrypt; HTTPS secures data in transit.
### Scheduling:

Background jobs (Bull/node-cron) dynamically manage patient reminders, decrementing number_of_days_left and marking tasks as done when complete.
New notes cancel old reminders to prevent conflicts.

### Data Storage:

MongoDB (Mongoose) offers flexible, scalable schema design with separate collections for each entity.
### Containerization:

Docker multi-stage builds create lightweight, secure production images using Node 22 and Node 22-alpine.
### Future Improvements
Integrate a robust scheduling system for real-time reminder updates.
Add patient check-in endpoints to update note statuses.
Implement rate limiting and additional security measures.
### License
This project is licensed under the MIT License.
