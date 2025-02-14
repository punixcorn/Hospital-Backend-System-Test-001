/*
 *  Handle routes for the authorization service
 */
import { Router } from "express";
import {
	signupHandler,
	loginHandler,
	logOutHandler,
	refreshHandler,
} from "./auth.controller.js";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logOutHandler);
router.post("/refresh", refreshHandler);

export default router;
