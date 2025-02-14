// src/patient/patient.routes.ts
import { Router } from "express";
import { listAvailableDoctors } from "./patient.controller.js";
import authenticate from "../../middleware/auth.middleware.js"; // A generic auth middleware
import { chooseDoctor } from "./patient.controller.js";
const router = Router();

// Apply authentication middleware for all patient routes
router.use(authenticate);

// Endpoint to list available doctors
router.get("/available-doctors", listAvailableDoctors);

// Endpoint for a patient to select a doctor
router.post("/select-doctor", chooseDoctor);

export default router;
