// src/api/doctor/doctor.routes.ts
import { Router } from "express";
import { getPatients } from "./doctor.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);
// Middleware for authentication would typically be applied here
router.get("/get_patients", getPatients);

export default router;
