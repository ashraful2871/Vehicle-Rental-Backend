import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

const router = Router();

const authController = new AuthController();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

router.post("/login", authController.login);

export default router;
