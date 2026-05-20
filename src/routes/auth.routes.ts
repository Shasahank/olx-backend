import { Router } from "express";

import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.post("/logout", logoutController);

export default router;
